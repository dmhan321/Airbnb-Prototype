const { Booking, Property, Traveler, Owner } = require('../models');
const { Op } = require('sequelize');

// Create booking (Traveler)
const createBooking = async (req, res) => {
  try {
    const { propertyId, startDate, endDate, guests } = req.body;
    const travelerId = req.user.id;

    // Check if property exists and is active
    const property = await Property.findByPk(propertyId);
    if (!property || !property.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or not available'
      });
    }

    // Check if property can accommodate guests
    if (guests > property.maxGuests) {
      return res.status(400).json({
        success: false,
        message: 'Property cannot accommodate this many guests'
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      where: {
        propertyId,
        status: ['PENDING', 'ACCEPTED'],
        [Op.or]: [
          {
            startDate: { [Op.between]: [startDate, endDate] }
          },
          {
            endDate: { [Op.between]: [startDate, endDate] }
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } }
            ]
          }
        ]
      }
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for the selected dates'
      });
    }

    // Calculate total price
    const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price * nights;

    // Create booking
    const booking = await Booking.create({
      travelerId,
      propertyId,
      startDate,
      endDate,
      guests,
      totalPrice,
      status: 'PENDING'
    });

    // Include property and traveler details in response
    const bookingWithDetails = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Property,
          as: 'property',
          include: [
            {
              model: Owner,
              as: 'owner',
              attributes: ['id', 'name', 'location']
            }
          ]
        },
        {
          model: Traveler,
          as: 'traveler',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: bookingWithDetails
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
};

// Get traveler's bookings
const getTravelerBookings = async (req, res) => {
  try {
    // Auto-complete bookings first
    await autoCompleteBookings();
    
    const travelerId = req.user.id;

    const bookings = await Booking.findAll({
      where: { travelerId },
      include: [
        {
          model: Property,
          as: 'property',
          include: [
            {
              model: Owner,
              as: 'owner',
              attributes: ['id', 'name', 'location']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get traveler bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings'
    });
  }
};

// Get owner's booking requests
const getOwnerBookings = async (req, res) => {
  try {
    // Auto-complete bookings first
    await autoCompleteBookings();
    
    const ownerId = req.user.id;

    // Get owner's properties
    const ownerProperties = await Property.findAll({
      where: { ownerId },
      attributes: ['id']
    });

    const propertyIds = ownerProperties.map(property => property.id);

    if (propertyIds.length === 0) {
      return res.json({
        success: true,
        bookings: []
      });
    }

    const bookings = await Booking.findAll({
      where: { propertyId: propertyIds },
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'name', 'location']
        },
        {
          model: Traveler,
          as: 'traveler',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get owner bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking requests'
    });
  }
};

// Accept booking (Owner)
const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.id;


    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Property,
          as: 'property',
          where: { ownerId }
        }
      ]
    });


    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not authorized'
      });
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not in pending status'
      });
    }

    await booking.update({ status: 'ACCEPTED' });

    res.json({
      success: true,
      message: 'Booking accepted successfully',
      booking
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept booking'
    });
  }
};

// Cancel booking (Owner or Traveler)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userType = req.userType;


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Property,
          as: 'property'
        }
      ]
    });


    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const isTraveler = userType === 'traveler' && booking.travelerId === userId;
    const isOwner = userType === 'owner' && booking.property.ownerId === userId;


    if (!isTraveler && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    await booking.update({ status: 'CANCELLED' });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
};

// Get blocked dates for a property
const getPropertyBlockedDates = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Get all bookings for this property that are not cancelled
    const bookings = await Booking.findAll({
      where: {
        propertyId: propertyId,
        status: {
          [Op.in]: ['PENDING', 'ACCEPTED']
        }
      },
      attributes: ['startDate', 'endDate']
    });

    // Generate list of blocked dates
    const blockedDates = [];
    
    bookings.forEach(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        if (!blockedDates.includes(dateString)) {
          blockedDates.push(dateString);
        }
      }
    });

    res.json({
      success: true,
      blockedDates: blockedDates.sort()
    });
  } catch (error) {
    console.error('Get blocked dates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blocked dates'
    });
  }
};

// Auto-complete bookings that have passed their checkout date
const autoCompleteBookings = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const result = await Booking.update(
      { status: 'COMPLETED' },
      {
        where: {
          status: 'ACCEPTED',
          endDate: {
            [Op.lt]: today
          }
        }
      }
    );
    
    return result[0];
  } catch (error) {
    console.error('Error auto-completing bookings:', error);
    throw error;
  }
};

module.exports = {
  createBooking,
  getTravelerBookings,
  getOwnerBookings,
  acceptBooking,
  cancelBooking,
  getPropertyBlockedDates,
  autoCompleteBookings
};
