/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 251.0, "minX": 0.0, "maxY": 20911.0, "series": [{"data": [[0.0, 251.0], [0.1, 251.0], [0.2, 251.0], [0.3, 278.0], [0.4, 278.0], [0.5, 343.0], [0.6, 343.0], [0.7, 343.0], [0.8, 401.0], [0.9, 401.0], [1.0, 492.0], [1.1, 492.0], [1.2, 492.0], [1.3, 652.0], [1.4, 652.0], [1.5, 673.0], [1.6, 673.0], [1.7, 673.0], [1.8, 718.0], [1.9, 718.0], [2.0, 748.0], [2.1, 748.0], [2.2, 748.0], [2.3, 777.0], [2.4, 777.0], [2.5, 801.0], [2.6, 801.0], [2.7, 801.0], [2.8, 855.0], [2.9, 855.0], [3.0, 924.0], [3.1, 924.0], [3.2, 924.0], [3.3, 932.0], [3.4, 932.0], [3.5, 943.0], [3.6, 943.0], [3.7, 943.0], [3.8, 1003.0], [3.9, 1003.0], [4.0, 1006.0], [4.1, 1006.0], [4.2, 1006.0], [4.3, 1124.0], [4.4, 1124.0], [4.5, 1164.0], [4.6, 1164.0], [4.7, 1164.0], [4.8, 1230.0], [4.9, 1230.0], [5.0, 1301.0], [5.1, 1301.0], [5.2, 1301.0], [5.3, 1369.0], [5.4, 1369.0], [5.5, 1380.0], [5.6, 1380.0], [5.7, 1380.0], [5.8, 1438.0], [5.9, 1438.0], [6.0, 1441.0], [6.1, 1441.0], [6.2, 1441.0], [6.3, 1507.0], [6.4, 1507.0], [6.5, 1592.0], [6.6, 1592.0], [6.7, 1592.0], [6.8, 1662.0], [6.9, 1662.0], [7.0, 1675.0], [7.1, 1675.0], [7.2, 1675.0], [7.3, 1815.0], [7.4, 1815.0], [7.5, 1817.0], [7.6, 1817.0], [7.7, 1817.0], [7.8, 1825.0], [7.9, 1825.0], [8.0, 1827.0], [8.1, 1827.0], [8.2, 1827.0], [8.3, 1854.0], [8.4, 1854.0], [8.5, 1898.0], [8.6, 1898.0], [8.7, 1898.0], [8.8, 1965.0], [8.9, 1965.0], [9.0, 1977.0], [9.1, 1977.0], [9.2, 1977.0], [9.3, 2039.0], [9.4, 2039.0], [9.5, 2126.0], [9.6, 2126.0], [9.7, 2126.0], [9.8, 2267.0], [9.9, 2267.0], [10.0, 2349.0], [10.1, 2349.0], [10.2, 2349.0], [10.3, 2350.0], [10.4, 2350.0], [10.5, 2365.0], [10.6, 2365.0], [10.7, 2365.0], [10.8, 2386.0], [10.9, 2386.0], [11.0, 2458.0], [11.1, 2458.0], [11.2, 2458.0], [11.3, 2521.0], [11.4, 2521.0], [11.5, 2534.0], [11.6, 2534.0], [11.7, 2534.0], [11.8, 2561.0], [11.9, 2561.0], [12.0, 2613.0], [12.1, 2613.0], [12.2, 2613.0], [12.3, 2620.0], [12.4, 2620.0], [12.5, 2662.0], [12.6, 2662.0], [12.7, 2662.0], [12.8, 2691.0], [12.9, 2691.0], [13.0, 2695.0], [13.1, 2695.0], [13.2, 2695.0], [13.3, 2765.0], [13.4, 2765.0], [13.5, 2767.0], [13.6, 2767.0], [13.7, 2767.0], [13.8, 2834.0], [13.9, 2834.0], [14.0, 2838.0], [14.1, 2838.0], [14.2, 2838.0], [14.3, 2855.0], [14.4, 2855.0], [14.5, 2858.0], [14.6, 2858.0], [14.7, 2858.0], [14.8, 2933.0], [14.9, 2933.0], [15.0, 2945.0], [15.1, 2945.0], [15.2, 2945.0], [15.3, 2987.0], [15.4, 2987.0], [15.5, 3005.0], [15.6, 3005.0], [15.7, 3005.0], [15.8, 3008.0], [15.9, 3008.0], [16.0, 3039.0], [16.1, 3039.0], [16.2, 3039.0], [16.3, 3062.0], [16.4, 3062.0], [16.5, 3068.0], [16.6, 3068.0], [16.7, 3068.0], [16.8, 3082.0], [16.9, 3082.0], [17.0, 3092.0], [17.1, 3092.0], [17.2, 3092.0], [17.3, 3093.0], [17.4, 3093.0], [17.5, 3157.0], [17.6, 3157.0], [17.7, 3157.0], [17.8, 3166.0], [17.9, 3166.0], [18.0, 3172.0], [18.1, 3172.0], [18.2, 3172.0], [18.3, 3231.0], [18.4, 3231.0], [18.5, 3231.0], [18.6, 3231.0], [18.7, 3231.0], [18.8, 3243.0], [18.9, 3243.0], [19.0, 3303.0], [19.1, 3303.0], [19.2, 3303.0], [19.3, 3311.0], [19.4, 3311.0], [19.5, 3337.0], [19.6, 3337.0], [19.7, 3337.0], [19.8, 3374.0], [19.9, 3374.0], [20.0, 3376.0], [20.1, 3376.0], [20.2, 3376.0], [20.3, 3487.0], [20.4, 3487.0], [20.5, 3524.0], [20.6, 3524.0], [20.7, 3524.0], [20.8, 3598.0], [20.9, 3598.0], [21.0, 3649.0], [21.1, 3649.0], [21.2, 3649.0], [21.3, 3658.0], [21.4, 3658.0], [21.5, 3662.0], [21.6, 3662.0], [21.7, 3662.0], [21.8, 3707.0], [21.9, 3707.0], [22.0, 3740.0], [22.1, 3740.0], [22.2, 3740.0], [22.3, 3763.0], [22.4, 3763.0], [22.5, 3776.0], [22.6, 3776.0], [22.7, 3776.0], [22.8, 3806.0], [22.9, 3806.0], [23.0, 3808.0], [23.1, 3808.0], [23.2, 3808.0], [23.3, 3820.0], [23.4, 3820.0], [23.5, 3846.0], [23.6, 3846.0], [23.7, 3846.0], [23.8, 3896.0], [23.9, 3896.0], [24.0, 3951.0], [24.1, 3951.0], [24.2, 3951.0], [24.3, 4046.0], [24.4, 4046.0], [24.5, 4135.0], [24.6, 4135.0], [24.7, 4135.0], [24.8, 4162.0], [24.9, 4162.0], [25.0, 4167.0], [25.1, 4167.0], [25.2, 4167.0], [25.3, 4168.0], [25.4, 4168.0], [25.5, 4218.0], [25.6, 4218.0], [25.7, 4218.0], [25.8, 4237.0], [25.9, 4237.0], [26.0, 4270.0], [26.1, 4270.0], [26.2, 4270.0], [26.3, 4320.0], [26.4, 4320.0], [26.5, 4326.0], [26.6, 4326.0], [26.7, 4326.0], [26.8, 4351.0], [26.9, 4351.0], [27.0, 4367.0], [27.1, 4367.0], [27.2, 4367.0], [27.3, 4388.0], [27.4, 4388.0], [27.5, 4418.0], [27.6, 4418.0], [27.7, 4418.0], [27.8, 4443.0], [27.9, 4443.0], [28.0, 4525.0], [28.1, 4525.0], [28.2, 4525.0], [28.3, 4599.0], [28.4, 4599.0], [28.5, 4618.0], [28.6, 4618.0], [28.7, 4618.0], [28.8, 4672.0], [28.9, 4672.0], [29.0, 4674.0], [29.1, 4674.0], [29.2, 4674.0], [29.3, 4688.0], [29.4, 4688.0], [29.5, 4739.0], [29.6, 4739.0], [29.7, 4739.0], [29.8, 4766.0], [29.9, 4766.0], [30.0, 4806.0], [30.1, 4806.0], [30.2, 4806.0], [30.3, 4813.0], [30.4, 4813.0], [30.5, 4866.0], [30.6, 4866.0], [30.7, 4866.0], [30.8, 4933.0], [30.9, 4933.0], [31.0, 4961.0], [31.1, 4961.0], [31.2, 4961.0], [31.3, 4968.0], [31.4, 4968.0], [31.5, 5011.0], [31.6, 5011.0], [31.7, 5011.0], [31.8, 5036.0], [31.9, 5036.0], [32.0, 5038.0], [32.1, 5038.0], [32.2, 5038.0], [32.3, 5108.0], [32.4, 5108.0], [32.5, 5114.0], [32.6, 5114.0], [32.7, 5114.0], [32.8, 5140.0], [32.9, 5140.0], [33.0, 5144.0], [33.1, 5144.0], [33.2, 5144.0], [33.3, 5189.0], [33.4, 5189.0], [33.5, 5317.0], [33.6, 5317.0], [33.7, 5317.0], [33.8, 5331.0], [33.9, 5331.0], [34.0, 5385.0], [34.1, 5385.0], [34.2, 5385.0], [34.3, 5400.0], [34.4, 5400.0], [34.5, 5436.0], [34.6, 5436.0], [34.7, 5436.0], [34.8, 5464.0], [34.9, 5464.0], [35.0, 5471.0], [35.1, 5471.0], [35.2, 5471.0], [35.3, 5480.0], [35.4, 5480.0], [35.5, 5550.0], [35.6, 5550.0], [35.7, 5550.0], [35.8, 5682.0], [35.9, 5682.0], [36.0, 5707.0], [36.1, 5707.0], [36.2, 5707.0], [36.3, 5715.0], [36.4, 5715.0], [36.5, 5836.0], [36.6, 5836.0], [36.7, 5836.0], [36.8, 5914.0], [36.9, 5914.0], [37.0, 5961.0], [37.1, 5961.0], [37.2, 5961.0], [37.3, 6035.0], [37.4, 6035.0], [37.5, 6058.0], [37.6, 6058.0], [37.7, 6058.0], [37.8, 6072.0], [37.9, 6072.0], [38.0, 6117.0], [38.1, 6117.0], [38.2, 6117.0], [38.3, 6163.0], [38.4, 6163.0], [38.5, 6241.0], [38.6, 6241.0], [38.7, 6241.0], [38.8, 6275.0], [38.9, 6275.0], [39.0, 6282.0], [39.1, 6282.0], [39.2, 6282.0], [39.3, 6284.0], [39.4, 6284.0], [39.5, 6369.0], [39.6, 6369.0], [39.7, 6369.0], [39.8, 6427.0], [39.9, 6427.0], [40.0, 6459.0], [40.1, 6459.0], [40.2, 6459.0], [40.3, 6502.0], [40.4, 6502.0], [40.5, 6529.0], [40.6, 6529.0], [40.7, 6529.0], [40.8, 6564.0], [40.9, 6564.0], [41.0, 6598.0], [41.1, 6598.0], [41.2, 6598.0], [41.3, 6636.0], [41.4, 6636.0], [41.5, 6655.0], [41.6, 6655.0], [41.7, 6655.0], [41.8, 6679.0], [41.9, 6679.0], [42.0, 6732.0], [42.1, 6732.0], [42.2, 6732.0], [42.3, 6733.0], [42.4, 6733.0], [42.5, 6789.0], [42.6, 6789.0], [42.7, 6789.0], [42.8, 6810.0], [42.9, 6810.0], [43.0, 6860.0], [43.1, 6860.0], [43.2, 6860.0], [43.3, 6872.0], [43.4, 6872.0], [43.5, 6879.0], [43.6, 6879.0], [43.7, 6879.0], [43.8, 6881.0], [43.9, 6881.0], [44.0, 6902.0], [44.1, 6902.0], [44.2, 6902.0], [44.3, 6905.0], [44.4, 6905.0], [44.5, 6933.0], [44.6, 6933.0], [44.7, 6933.0], [44.8, 6936.0], [44.9, 6936.0], [45.0, 6998.0], [45.1, 6998.0], [45.2, 6998.0], [45.3, 7046.0], [45.4, 7046.0], [45.5, 7067.0], [45.6, 7067.0], [45.7, 7067.0], [45.8, 7087.0], [45.9, 7087.0], [46.0, 7118.0], [46.1, 7118.0], [46.2, 7118.0], [46.3, 7143.0], [46.4, 7143.0], [46.5, 7160.0], [46.6, 7160.0], [46.7, 7160.0], [46.8, 7170.0], [46.9, 7170.0], [47.0, 7194.0], [47.1, 7194.0], [47.2, 7194.0], [47.3, 7228.0], [47.4, 7228.0], [47.5, 7246.0], [47.6, 7246.0], [47.7, 7246.0], [47.8, 7309.0], [47.9, 7309.0], [48.0, 7319.0], [48.1, 7319.0], [48.2, 7319.0], [48.3, 7343.0], [48.4, 7343.0], [48.5, 7361.0], [48.6, 7361.0], [48.7, 7361.0], [48.8, 7391.0], [48.9, 7391.0], [49.0, 7401.0], [49.1, 7401.0], [49.2, 7401.0], [49.3, 7435.0], [49.4, 7435.0], [49.5, 7458.0], [49.6, 7458.0], [49.7, 7458.0], [49.8, 7494.0], [49.9, 7494.0], [50.0, 7534.0], [50.1, 7534.0], [50.2, 7534.0], [50.3, 7566.0], [50.4, 7566.0], [50.5, 7589.0], [50.6, 7589.0], [50.7, 7589.0], [50.8, 7603.0], [50.9, 7603.0], [51.0, 7639.0], [51.1, 7639.0], [51.2, 7639.0], [51.3, 7660.0], [51.4, 7660.0], [51.5, 7786.0], [51.6, 7786.0], [51.7, 7786.0], [51.8, 7790.0], [51.9, 7790.0], [52.0, 7810.0], [52.1, 7810.0], [52.2, 7810.0], [52.3, 7812.0], [52.4, 7812.0], [52.5, 7903.0], [52.6, 7903.0], [52.7, 7903.0], [52.8, 7921.0], [52.9, 7921.0], [53.0, 7924.0], [53.1, 7924.0], [53.2, 7924.0], [53.3, 7937.0], [53.4, 7937.0], [53.5, 7956.0], [53.6, 7956.0], [53.7, 7956.0], [53.8, 7958.0], [53.9, 7958.0], [54.0, 8026.0], [54.1, 8026.0], [54.2, 8026.0], [54.3, 8031.0], [54.4, 8031.0], [54.5, 8090.0], [54.6, 8090.0], [54.7, 8090.0], [54.8, 8108.0], [54.9, 8108.0], [55.0, 8134.0], [55.1, 8134.0], [55.2, 8134.0], [55.3, 8166.0], [55.4, 8166.0], [55.5, 8212.0], [55.6, 8212.0], [55.7, 8212.0], [55.8, 8242.0], [55.9, 8242.0], [56.0, 8279.0], [56.1, 8279.0], [56.2, 8279.0], [56.3, 8291.0], [56.4, 8291.0], [56.5, 8314.0], [56.6, 8314.0], [56.7, 8314.0], [56.8, 8359.0], [56.9, 8359.0], [57.0, 8376.0], [57.1, 8376.0], [57.2, 8376.0], [57.3, 8450.0], [57.4, 8450.0], [57.5, 8499.0], [57.6, 8499.0], [57.7, 8499.0], [57.8, 8517.0], [57.9, 8517.0], [58.0, 8580.0], [58.1, 8580.0], [58.2, 8580.0], [58.3, 8677.0], [58.4, 8677.0], [58.5, 8730.0], [58.6, 8730.0], [58.7, 8730.0], [58.8, 8776.0], [58.9, 8776.0], [59.0, 8805.0], [59.1, 8805.0], [59.2, 8805.0], [59.3, 8822.0], [59.4, 8822.0], [59.5, 8895.0], [59.6, 8895.0], [59.7, 8895.0], [59.8, 8924.0], [59.9, 8924.0], [60.0, 8926.0], [60.1, 8926.0], [60.2, 8926.0], [60.3, 8956.0], [60.4, 8956.0], [60.5, 8965.0], [60.6, 8965.0], [60.7, 8965.0], [60.8, 8997.0], [60.9, 8997.0], [61.0, 9040.0], [61.1, 9040.0], [61.2, 9040.0], [61.3, 9078.0], [61.4, 9078.0], [61.5, 9080.0], [61.6, 9080.0], [61.7, 9080.0], [61.8, 9093.0], [61.9, 9093.0], [62.0, 9173.0], [62.1, 9173.0], [62.2, 9173.0], [62.3, 9243.0], [62.4, 9243.0], [62.5, 9436.0], [62.6, 9436.0], [62.7, 9436.0], [62.8, 9441.0], [62.9, 9441.0], [63.0, 9446.0], [63.1, 9446.0], [63.2, 9446.0], [63.3, 9449.0], [63.4, 9449.0], [63.5, 9477.0], [63.6, 9477.0], [63.7, 9477.0], [63.8, 9512.0], [63.9, 9512.0], [64.0, 9595.0], [64.1, 9595.0], [64.2, 9595.0], [64.3, 9633.0], [64.4, 9633.0], [64.5, 9664.0], [64.6, 9664.0], [64.7, 9664.0], [64.8, 9671.0], [64.9, 9671.0], [65.0, 9674.0], [65.1, 9674.0], [65.2, 9674.0], [65.3, 9751.0], [65.4, 9751.0], [65.5, 9784.0], [65.6, 9784.0], [65.7, 9784.0], [65.8, 9823.0], [65.9, 9823.0], [66.0, 9898.0], [66.1, 9898.0], [66.2, 9898.0], [66.3, 10001.0], [66.4, 10001.0], [66.5, 10021.0], [66.6, 10021.0], [66.7, 10021.0], [66.8, 10022.0], [66.9, 10022.0], [67.0, 10079.0], [67.1, 10079.0], [67.2, 10079.0], [67.3, 10123.0], [67.4, 10123.0], [67.5, 10170.0], [67.6, 10170.0], [67.7, 10170.0], [67.8, 10178.0], [67.9, 10178.0], [68.0, 10196.0], [68.1, 10196.0], [68.2, 10196.0], [68.3, 10250.0], [68.4, 10250.0], [68.5, 10310.0], [68.6, 10310.0], [68.7, 10310.0], [68.8, 10328.0], [68.9, 10328.0], [69.0, 10330.0], [69.1, 10330.0], [69.2, 10330.0], [69.3, 10347.0], [69.4, 10347.0], [69.5, 10350.0], [69.6, 10350.0], [69.7, 10350.0], [69.8, 10395.0], [69.9, 10395.0], [70.0, 10481.0], [70.1, 10481.0], [70.2, 10481.0], [70.3, 10500.0], [70.4, 10500.0], [70.5, 10517.0], [70.6, 10517.0], [70.7, 10517.0], [70.8, 10530.0], [70.9, 10530.0], [71.0, 10570.0], [71.1, 10570.0], [71.2, 10570.0], [71.3, 10576.0], [71.4, 10576.0], [71.5, 10578.0], [71.6, 10578.0], [71.7, 10578.0], [71.8, 10592.0], [71.9, 10592.0], [72.0, 10625.0], [72.1, 10625.0], [72.2, 10625.0], [72.3, 10648.0], [72.4, 10648.0], [72.5, 10652.0], [72.6, 10652.0], [72.7, 10652.0], [72.8, 10663.0], [72.9, 10663.0], [73.0, 10745.0], [73.1, 10745.0], [73.2, 10745.0], [73.3, 10756.0], [73.4, 10756.0], [73.5, 10797.0], [73.6, 10797.0], [73.7, 10797.0], [73.8, 10802.0], [73.9, 10802.0], [74.0, 10804.0], [74.1, 10804.0], [74.2, 10804.0], [74.3, 10818.0], [74.4, 10818.0], [74.5, 10824.0], [74.6, 10824.0], [74.7, 10824.0], [74.8, 10848.0], [74.9, 10848.0], [75.0, 10871.0], [75.1, 10871.0], [75.2, 10871.0], [75.3, 10879.0], [75.4, 10879.0], [75.5, 10880.0], [75.6, 10880.0], [75.7, 10880.0], [75.8, 10891.0], [75.9, 10891.0], [76.0, 10897.0], [76.1, 10897.0], [76.2, 10897.0], [76.3, 10940.0], [76.4, 10940.0], [76.5, 10967.0], [76.6, 10967.0], [76.7, 10967.0], [76.8, 10970.0], [76.9, 10970.0], [77.0, 10997.0], [77.1, 10997.0], [77.2, 10997.0], [77.3, 11024.0], [77.4, 11024.0], [77.5, 11025.0], [77.6, 11025.0], [77.7, 11025.0], [77.8, 11026.0], [77.9, 11026.0], [78.0, 11043.0], [78.1, 11043.0], [78.2, 11043.0], [78.3, 11048.0], [78.4, 11048.0], [78.5, 11075.0], [78.6, 11075.0], [78.7, 11075.0], [78.8, 11086.0], [78.9, 11086.0], [79.0, 11096.0], [79.1, 11096.0], [79.2, 11096.0], [79.3, 11107.0], [79.4, 11107.0], [79.5, 11115.0], [79.6, 11115.0], [79.7, 11115.0], [79.8, 11120.0], [79.9, 11120.0], [80.0, 11160.0], [80.1, 11160.0], [80.2, 11160.0], [80.3, 11173.0], [80.4, 11173.0], [80.5, 11202.0], [80.6, 11202.0], [80.7, 11202.0], [80.8, 11221.0], [80.9, 11221.0], [81.0, 11224.0], [81.1, 11224.0], [81.2, 11224.0], [81.3, 11269.0], [81.4, 11269.0], [81.5, 11323.0], [81.6, 11323.0], [81.7, 11323.0], [81.8, 11330.0], [81.9, 11330.0], [82.0, 11370.0], [82.1, 11370.0], [82.2, 11370.0], [82.3, 11405.0], [82.4, 11405.0], [82.5, 11405.0], [82.6, 11405.0], [82.7, 11405.0], [82.8, 11417.0], [82.9, 11417.0], [83.0, 11470.0], [83.1, 11470.0], [83.2, 11470.0], [83.3, 11478.0], [83.4, 11478.0], [83.5, 11490.0], [83.6, 11490.0], [83.7, 11490.0], [83.8, 11502.0], [83.9, 11502.0], [84.0, 11541.0], [84.1, 11541.0], [84.2, 11541.0], [84.3, 11566.0], [84.4, 11566.0], [84.5, 11568.0], [84.6, 11568.0], [84.7, 11568.0], [84.8, 11642.0], [84.9, 11642.0], [85.0, 11643.0], [85.1, 11643.0], [85.2, 11643.0], [85.3, 11690.0], [85.4, 11690.0], [85.5, 11695.0], [85.6, 11695.0], [85.7, 11695.0], [85.8, 11698.0], [85.9, 11698.0], [86.0, 11703.0], [86.1, 11703.0], [86.2, 11703.0], [86.3, 11719.0], [86.4, 11719.0], [86.5, 11751.0], [86.6, 11751.0], [86.7, 11751.0], [86.8, 11787.0], [86.9, 11787.0], [87.0, 11789.0], [87.1, 11789.0], [87.2, 11789.0], [87.3, 11822.0], [87.4, 11822.0], [87.5, 11845.0], [87.6, 11845.0], [87.7, 11845.0], [87.8, 11863.0], [87.9, 11863.0], [88.0, 11933.0], [88.1, 11933.0], [88.2, 11933.0], [88.3, 12012.0], [88.4, 12012.0], [88.5, 12063.0], [88.6, 12063.0], [88.7, 12063.0], [88.8, 12077.0], [88.9, 12077.0], [89.0, 12148.0], [89.1, 12148.0], [89.2, 12148.0], [89.3, 12158.0], [89.4, 12158.0], [89.5, 12165.0], [89.6, 12165.0], [89.7, 12165.0], [89.8, 12225.0], [89.9, 12225.0], [90.0, 12228.0], [90.1, 12228.0], [90.2, 12228.0], [90.3, 12245.0], [90.4, 12245.0], [90.5, 12304.0], [90.6, 12304.0], [90.7, 12304.0], [90.8, 12311.0], [90.9, 12311.0], [91.0, 12365.0], [91.1, 12365.0], [91.2, 12365.0], [91.3, 12408.0], [91.4, 12408.0], [91.5, 12508.0], [91.6, 12508.0], [91.7, 12508.0], [91.8, 12542.0], [91.9, 12542.0], [92.0, 12659.0], [92.1, 12659.0], [92.2, 12659.0], [92.3, 12693.0], [92.4, 12693.0], [92.5, 12712.0], [92.6, 12712.0], [92.7, 12712.0], [92.8, 12722.0], [92.9, 12722.0], [93.0, 12756.0], [93.1, 12756.0], [93.2, 12756.0], [93.3, 12791.0], [93.4, 12791.0], [93.5, 12836.0], [93.6, 12836.0], [93.7, 12836.0], [93.8, 12865.0], [93.9, 12865.0], [94.0, 12902.0], [94.1, 12902.0], [94.2, 12902.0], [94.3, 12914.0], [94.4, 12914.0], [94.5, 12930.0], [94.6, 12930.0], [94.7, 12930.0], [94.8, 12943.0], [94.9, 12943.0], [95.0, 13019.0], [95.1, 13019.0], [95.2, 13019.0], [95.3, 13053.0], [95.4, 13053.0], [95.5, 13400.0], [95.6, 13400.0], [95.7, 13400.0], [95.8, 13426.0], [95.9, 13426.0], [96.0, 13475.0], [96.1, 13475.0], [96.2, 13475.0], [96.3, 13519.0], [96.4, 13519.0], [96.5, 13535.0], [96.6, 13535.0], [96.7, 13535.0], [96.8, 13666.0], [96.9, 13666.0], [97.0, 13768.0], [97.1, 13768.0], [97.2, 13768.0], [97.3, 14216.0], [97.4, 14216.0], [97.5, 14514.0], [97.6, 14514.0], [97.7, 14514.0], [97.8, 14681.0], [97.9, 14681.0], [98.0, 14716.0], [98.1, 14716.0], [98.2, 14716.0], [98.3, 16494.0], [98.4, 16494.0], [98.5, 16962.0], [98.6, 16962.0], [98.7, 16962.0], [98.8, 18805.0], [98.9, 18805.0], [99.0, 19548.0], [99.1, 19548.0], [99.2, 19548.0], [99.3, 19649.0], [99.4, 19649.0], [99.5, 20686.0], [99.6, 20686.0], [99.7, 20686.0], [99.8, 20911.0], [99.9, 20911.0]], "isOverall": false, "label": "Login Traveler", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 1.0, "minX": 200.0, "maxY": 10.0, "series": [{"data": [[200.0, 2.0], [300.0, 1.0], [400.0, 2.0], [600.0, 2.0], [700.0, 3.0], [800.0, 2.0], [900.0, 3.0], [1000.0, 2.0], [1100.0, 2.0], [1200.0, 1.0], [1300.0, 3.0], [1400.0, 2.0], [1500.0, 2.0], [1600.0, 2.0], [1800.0, 6.0], [1900.0, 2.0], [2000.0, 1.0], [2100.0, 1.0], [2300.0, 4.0], [2200.0, 1.0], [2400.0, 1.0], [2500.0, 3.0], [2600.0, 5.0], [2800.0, 4.0], [2700.0, 2.0], [2900.0, 3.0], [3000.0, 8.0], [3100.0, 3.0], [3200.0, 3.0], [3300.0, 5.0], [3400.0, 1.0], [3500.0, 2.0], [3600.0, 3.0], [3700.0, 4.0], [3800.0, 5.0], [3900.0, 1.0], [4000.0, 1.0], [4200.0, 3.0], [4300.0, 5.0], [4100.0, 4.0], [4400.0, 2.0], [4500.0, 2.0], [4600.0, 4.0], [4800.0, 3.0], [4700.0, 2.0], [5100.0, 5.0], [4900.0, 3.0], [5000.0, 3.0], [5300.0, 3.0], [5400.0, 5.0], [5500.0, 1.0], [5600.0, 1.0], [5700.0, 2.0], [5800.0, 1.0], [6100.0, 2.0], [5900.0, 2.0], [6000.0, 3.0], [6200.0, 4.0], [6300.0, 1.0], [6600.0, 3.0], [6500.0, 4.0], [6400.0, 2.0], [6900.0, 5.0], [6800.0, 5.0], [6700.0, 3.0], [7100.0, 5.0], [7000.0, 3.0], [7400.0, 4.0], [7300.0, 5.0], [7200.0, 2.0], [7600.0, 3.0], [7500.0, 3.0], [7900.0, 6.0], [7700.0, 2.0], [7800.0, 2.0], [8000.0, 3.0], [8100.0, 3.0], [8200.0, 4.0], [8700.0, 2.0], [8500.0, 2.0], [8400.0, 2.0], [8300.0, 3.0], [8600.0, 1.0], [8800.0, 3.0], [9000.0, 4.0], [8900.0, 5.0], [9200.0, 1.0], [9100.0, 1.0], [9400.0, 5.0], [9600.0, 4.0], [9700.0, 2.0], [9500.0, 2.0], [10000.0, 4.0], [10100.0, 4.0], [9800.0, 2.0], [10200.0, 1.0], [10500.0, 7.0], [10300.0, 6.0], [10600.0, 4.0], [10700.0, 3.0], [10400.0, 1.0], [11100.0, 5.0], [11000.0, 8.0], [10800.0, 10.0], [11200.0, 4.0], [10900.0, 4.0], [11600.0, 5.0], [11400.0, 6.0], [11700.0, 5.0], [11500.0, 4.0], [11300.0, 3.0], [11800.0, 3.0], [12100.0, 3.0], [12200.0, 3.0], [12000.0, 3.0], [11900.0, 1.0], [12500.0, 2.0], [12700.0, 4.0], [12600.0, 2.0], [12300.0, 3.0], [12400.0, 1.0], [12800.0, 2.0], [12900.0, 4.0], [13000.0, 2.0], [13600.0, 1.0], [13700.0, 1.0], [13400.0, 3.0], [13500.0, 2.0], [14200.0, 1.0], [14500.0, 1.0], [14700.0, 1.0], [14600.0, 1.0], [16900.0, 1.0], [16400.0, 1.0], [18800.0, 1.0], [19600.0, 1.0], [19500.0, 1.0], [20900.0, 1.0], [20600.0, 1.0]], "isOverall": false, "label": "Login Traveler", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 20900.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 5.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 375.0, "series": [{"data": [[0.0, 5.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 20.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 375.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 61.05128205128203, "minX": 1.7636034E12, "maxY": 77.09187279151946, "series": [{"data": [[1.7636034E12, 77.09187279151946], [1.76360346E12, 61.05128205128203]], "isOverall": false, "label": "Authentication Test - 400 Users", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.76360346E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 385.0, "minX": 2.0, "maxY": 20798.5, "series": [{"data": [[2.0, 20798.5], [3.0, 14681.0], [5.0, 10857.5], [6.0, 385.0], [7.0, 4842.4], [8.0, 3855.0], [10.0, 718.0], [11.0, 8433.25], [12.0, 5292.25], [13.0, 5737.0], [14.0, 5897.5], [15.0, 4088.3333333333335], [16.0, 4576.0], [17.0, 1301.0], [18.0, 12547.5], [19.0, 977.0], [20.0, 5962.4], [21.0, 7149.5], [22.0, 6098.5], [23.0, 10824.0], [24.0, 11269.0], [25.0, 11642.0], [26.0, 5676.666666666666], [28.0, 2039.25], [29.0, 9498.25], [30.0, 4750.0], [33.0, 2365.0], [32.0, 2308.0], [35.0, 11074.0], [37.0, 5607.714285714285], [36.0, 2819.8], [38.0, 7718.0], [40.0, 7375.8], [41.0, 2642.75], [43.0, 3301.5], [42.0, 3082.0], [44.0, 2818.8], [47.0, 3081.0], [49.0, 3378.0], [48.0, 2521.0], [51.0, 3255.6666666666665], [50.0, 3376.0], [53.0, 10476.666666666668], [52.0, 12365.666666666666], [54.0, 3871.714285714286], [57.0, 10517.0], [56.0, 10742.666666666666], [59.0, 6312.666666666666], [58.0, 11323.0], [61.0, 4016.5], [60.0, 7746.0], [63.0, 8039.0], [62.0, 4111.0], [65.0, 6141.923076923077], [66.0, 6601.333333333334], [64.0, 3591.0], [67.0, 5114.0], [69.0, 7108.333333333333], [68.0, 7927.0], [71.0, 12077.0], [70.0, 12158.0], [75.0, 5652.666666666667], [74.0, 12659.0], [73.0, 12508.0], [72.0, 12225.0], [79.0, 5013.333333333333], [77.0, 6838.0], [76.0, 8307.6], [78.0, 8510.0], [81.0, 8843.5], [83.0, 9708.0], [80.0, 8883.8], [82.0, 5970.666666666667], [87.0, 6012.0], [86.0, 6536.333333333333], [85.0, 4961.0], [84.0, 5595.333333333333], [88.0, 8491.5], [93.0, 9041.25], [92.0, 6790.5], [95.0, 12197.222222222223], [94.0, 10022.0], [97.0, 6763.0], [99.0, 8158.333333333333], [98.0, 8449.5], [96.0, 8169.75], [103.0, 7601.25], [102.0, 6728.8], [100.0, 7298.125], [101.0, 9190.0], [106.0, 9789.307692307693], [105.0, 6608.333333333333], [104.0, 8144.333333333333], [108.0, 7805.714285714286], [110.0, 7355.0], [111.0, 9442.0], [109.0, 8359.0], [115.0, 8357.0], [113.0, 7902.833333333333], [114.0, 10001.0], [118.0, 8877.5], [116.0, 8047.75], [119.0, 7861.5], [117.0, 10297.916666666668], [121.0, 9550.0], [123.0, 11478.0], [122.0, 10879.0], [126.0, 8517.0], [125.0, 12379.0], [124.0, 9038.75], [127.0, 10536.0], [135.0, 12190.0], [134.0, 9093.0], [133.0, 9243.0], [132.0, 9477.0], [131.0, 9049.5], [130.0, 9803.833333333334], [129.0, 10065.5], [128.0, 9002.5], [136.0, 11265.2], [139.0, 10947.5], [137.0, 9512.0]], "isOverall": false, "label": "Login Traveler", "isController": false}, {"data": [[72.40000000000003, 7525.334999999999]], "isOverall": false, "label": "Login Traveler-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 139.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 668.85, "minX": 1.7636034E12, "maxY": 4500.816666666667, "series": [{"data": [[1.7636034E12, 4500.816666666667], [1.76360346E12, 1862.25]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7636034E12, 1616.0166666666667], [1.76360346E12, 668.85]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.76360346E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 5711.272084805654, "minX": 1.7636034E12, "maxY": 11913.196581196578, "series": [{"data": [[1.7636034E12, 5711.272084805654], [1.76360346E12, 11913.196581196578]], "isOverall": false, "label": "Login Traveler", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.76360346E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 5711.11307420495, "minX": 1.7636034E12, "maxY": 11913.15384615385, "series": [{"data": [[1.7636034E12, 5711.11307420495], [1.76360346E12, 11913.15384615385]], "isOverall": false, "label": "Login Traveler", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.76360346E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 63.829059829059844, "minX": 1.7636034E12, "maxY": 186.2544169611308, "series": [{"data": [[1.7636034E12, 186.2544169611308], [1.76360346E12, 63.829059829059844]], "isOverall": false, "label": "Login Traveler", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.76360346E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 251.0, "minX": 1.7636034E12, "maxY": 20911.0, "series": [{"data": [[1.7636034E12, 19649.0], [1.76360346E12, 20911.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7636034E12, 251.0], [1.76360346E12, 9449.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7636034E12, 9561.8], [1.76360346E12, 13483.8]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7636034E12, 16568.880000000012], [1.76360346E12, 20870.5]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7636034E12, 5480.0], [1.76360346E12, 11490.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.7636034E12, 10627.600000000002], [1.76360346E12, 14684.5]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.76360346E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 1628.0, "minX": 1.0, "maxY": 11642.0, "series": [{"data": [[8.0, 3811.5], [2.0, 1628.0], [33.0, 11642.0], [9.0, 3082.0], [10.0, 5840.5], [11.0, 8807.5], [12.0, 7208.0], [13.0, 11568.0], [14.0, 10050.5], [15.0, 5707.0], [1.0, 4494.5], [17.0, 6818.5], [18.0, 7722.0], [19.0, 2349.0], [5.0, 4618.0], [21.0, 4320.0], [22.0, 9614.0], [6.0, 3723.5], [7.0, 4813.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 33.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 1628.0, "minX": 1.0, "maxY": 11642.0, "series": [{"data": [[8.0, 3811.5], [2.0, 1628.0], [33.0, 11642.0], [9.0, 3082.0], [10.0, 5840.5], [11.0, 8807.0], [12.0, 7208.0], [13.0, 11568.0], [14.0, 10050.5], [15.0, 5707.0], [1.0, 4494.5], [17.0, 6818.5], [18.0, 7722.0], [19.0, 2349.0], [5.0, 4618.0], [21.0, 4320.0], [22.0, 9613.5], [6.0, 3723.0], [7.0, 4813.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 33.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 6.666666666666667, "minX": 1.7636034E12, "maxY": 6.666666666666667, "series": [{"data": [[1.7636034E12, 6.666666666666667]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7636034E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 1.95, "minX": 1.7636034E12, "maxY": 4.716666666666667, "series": [{"data": [[1.7636034E12, 4.716666666666667], [1.76360346E12, 1.95]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.76360346E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 1.95, "minX": 1.7636034E12, "maxY": 4.716666666666667, "series": [{"data": [[1.7636034E12, 4.716666666666667], [1.76360346E12, 1.95]], "isOverall": false, "label": "Login Traveler-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.76360346E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 1.95, "minX": 1.7636034E12, "maxY": 4.716666666666667, "series": [{"data": [[1.7636034E12, 4.716666666666667], [1.76360346E12, 1.95]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.76360346E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

