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
        data: {"result": {"minY": 55.0, "minX": 0.0, "maxY": 4946.0, "series": [{"data": [[0.0, 55.0], [0.1, 55.0], [0.2, 55.0], [0.3, 56.0], [0.4, 56.0], [0.5, 56.0], [0.6, 56.0], [0.7, 56.0], [0.8, 57.0], [0.9, 57.0], [1.0, 57.0], [1.1, 57.0], [1.2, 57.0], [1.3, 57.0], [1.4, 57.0], [1.5, 57.0], [1.6, 58.0], [1.7, 58.0], [1.8, 58.0], [1.9, 58.0], [2.0, 58.0], [2.1, 58.0], [2.2, 58.0], [2.3, 58.0], [2.4, 58.0], [2.5, 58.0], [2.6, 59.0], [2.7, 59.0], [2.8, 59.0], [2.9, 59.0], [3.0, 59.0], [3.1, 59.0], [3.2, 59.0], [3.3, 59.0], [3.4, 59.0], [3.5, 59.0], [3.6, 59.0], [3.7, 59.0], [3.8, 59.0], [3.9, 59.0], [4.0, 59.0], [4.1, 59.0], [4.2, 59.0], [4.3, 59.0], [4.4, 59.0], [4.5, 59.0], [4.6, 59.0], [4.7, 59.0], [4.8, 59.0], [4.9, 59.0], [5.0, 60.0], [5.1, 60.0], [5.2, 60.0], [5.3, 60.0], [5.4, 60.0], [5.5, 60.0], [5.6, 60.0], [5.7, 60.0], [5.8, 60.0], [5.9, 60.0], [6.0, 60.0], [6.1, 60.0], [6.2, 60.0], [6.3, 60.0], [6.4, 60.0], [6.5, 60.0], [6.6, 60.0], [6.7, 60.0], [6.8, 60.0], [6.9, 60.0], [7.0, 61.0], [7.1, 61.0], [7.2, 61.0], [7.3, 61.0], [7.4, 61.0], [7.5, 61.0], [7.6, 61.0], [7.7, 61.0], [7.8, 61.0], [7.9, 61.0], [8.0, 61.0], [8.1, 61.0], [8.2, 61.0], [8.3, 61.0], [8.4, 61.0], [8.5, 61.0], [8.6, 61.0], [8.7, 61.0], [8.8, 61.0], [8.9, 61.0], [9.0, 61.0], [9.1, 61.0], [9.2, 62.0], [9.3, 62.0], [9.4, 62.0], [9.5, 62.0], [9.6, 62.0], [9.7, 62.0], [9.8, 62.0], [9.9, 62.0], [10.0, 62.0], [10.1, 62.0], [10.2, 62.0], [10.3, 62.0], [10.4, 62.0], [10.5, 62.0], [10.6, 62.0], [10.7, 62.0], [10.8, 62.0], [10.9, 62.0], [11.0, 62.0], [11.1, 62.0], [11.2, 62.0], [11.3, 62.0], [11.4, 62.0], [11.5, 62.0], [11.6, 63.0], [11.7, 63.0], [11.8, 63.0], [11.9, 63.0], [12.0, 63.0], [12.1, 63.0], [12.2, 63.0], [12.3, 63.0], [12.4, 63.0], [12.5, 63.0], [12.6, 63.0], [12.7, 63.0], [12.8, 63.0], [12.9, 63.0], [13.0, 63.0], [13.1, 63.0], [13.2, 64.0], [13.3, 64.0], [13.4, 64.0], [13.5, 64.0], [13.6, 64.0], [13.7, 64.0], [13.8, 64.0], [13.9, 64.0], [14.0, 64.0], [14.1, 65.0], [14.2, 65.0], [14.3, 65.0], [14.4, 65.0], [14.5, 65.0], [14.6, 65.0], [14.7, 65.0], [14.8, 65.0], [14.9, 65.0], [15.0, 65.0], [15.1, 66.0], [15.2, 66.0], [15.3, 66.0], [15.4, 66.0], [15.5, 66.0], [15.6, 66.0], [15.7, 66.0], [15.8, 66.0], [15.9, 66.0], [16.0, 67.0], [16.1, 67.0], [16.2, 67.0], [16.3, 67.0], [16.4, 67.0], [16.5, 67.0], [16.6, 68.0], [16.7, 68.0], [16.8, 68.0], [16.9, 69.0], [17.0, 69.0], [17.1, 69.0], [17.2, 71.0], [17.3, 71.0], [17.4, 71.0], [17.5, 72.0], [17.6, 72.0], [17.7, 72.0], [17.8, 74.0], [17.9, 74.0], [18.0, 74.0], [18.1, 75.0], [18.2, 76.0], [18.3, 76.0], [18.4, 78.0], [18.5, 78.0], [18.6, 81.0], [18.7, 83.0], [18.8, 85.0], [18.9, 85.0], [19.0, 87.0], [19.1, 90.0], [19.2, 91.0], [19.3, 91.0], [19.4, 94.0], [19.5, 94.0], [19.6, 96.0], [19.7, 96.0], [19.8, 99.0], [19.9, 100.0], [20.0, 102.0], [20.1, 104.0], [20.2, 105.0], [20.3, 105.0], [20.4, 106.0], [20.5, 106.0], [20.6, 106.0], [20.7, 106.0], [20.8, 107.0], [20.9, 107.0], [21.0, 107.0], [21.1, 108.0], [21.2, 108.0], [21.3, 108.0], [21.4, 108.0], [21.5, 108.0], [21.6, 108.0], [21.7, 108.0], [21.8, 108.0], [21.9, 109.0], [22.0, 109.0], [22.1, 109.0], [22.2, 109.0], [22.3, 109.0], [22.4, 109.0], [22.5, 109.0], [22.6, 109.0], [22.7, 110.0], [22.8, 110.0], [22.9, 110.0], [23.0, 110.0], [23.1, 110.0], [23.2, 110.0], [23.3, 110.0], [23.4, 110.0], [23.5, 110.0], [23.6, 110.0], [23.7, 111.0], [23.8, 111.0], [23.9, 111.0], [24.0, 111.0], [24.1, 111.0], [24.2, 111.0], [24.3, 111.0], [24.4, 111.0], [24.5, 111.0], [24.6, 112.0], [24.7, 112.0], [24.8, 112.0], [24.9, 112.0], [25.0, 112.0], [25.1, 112.0], [25.2, 112.0], [25.3, 112.0], [25.4, 112.0], [25.5, 112.0], [25.6, 112.0], [25.7, 112.0], [25.8, 113.0], [25.9, 113.0], [26.0, 113.0], [26.1, 113.0], [26.2, 113.0], [26.3, 113.0], [26.4, 114.0], [26.5, 114.0], [26.6, 114.0], [26.7, 114.0], [26.8, 115.0], [26.9, 115.0], [27.0, 115.0], [27.1, 115.0], [27.2, 116.0], [27.3, 116.0], [27.4, 117.0], [27.5, 117.0], [27.6, 117.0], [27.7, 118.0], [27.8, 118.0], [27.9, 119.0], [28.0, 119.0], [28.1, 119.0], [28.2, 119.0], [28.3, 119.0], [28.4, 121.0], [28.5, 122.0], [28.6, 123.0], [28.7, 123.0], [28.8, 124.0], [28.9, 125.0], [29.0, 125.0], [29.1, 126.0], [29.2, 128.0], [29.3, 128.0], [29.4, 129.0], [29.5, 131.0], [29.6, 132.0], [29.7, 134.0], [29.8, 135.0], [29.9, 135.0], [30.0, 137.0], [30.1, 138.0], [30.2, 143.0], [30.3, 144.0], [30.4, 145.0], [30.5, 148.0], [30.6, 153.0], [30.7, 154.0], [30.8, 157.0], [30.9, 159.0], [31.0, 167.0], [31.1, 167.0], [31.2, 169.0], [31.3, 173.0], [31.4, 174.0], [31.5, 177.0], [31.6, 183.0], [31.7, 183.0], [31.8, 198.0], [31.9, 199.0], [32.0, 205.0], [32.1, 206.0], [32.2, 208.0], [32.3, 210.0], [32.4, 216.0], [32.5, 217.0], [32.6, 218.0], [32.7, 224.0], [32.8, 225.0], [32.9, 230.0], [33.0, 232.0], [33.1, 235.0], [33.2, 239.0], [33.3, 239.0], [33.4, 241.0], [33.5, 242.0], [33.6, 243.0], [33.7, 245.0], [33.8, 246.0], [33.9, 249.0], [34.0, 251.0], [34.1, 261.0], [34.2, 262.0], [34.3, 263.0], [34.4, 265.0], [34.5, 266.0], [34.6, 267.0], [34.7, 269.0], [34.8, 270.0], [34.9, 274.0], [35.0, 276.0], [35.1, 280.0], [35.2, 285.0], [35.3, 287.0], [35.4, 293.0], [35.5, 299.0], [35.6, 302.0], [35.7, 304.0], [35.8, 304.0], [35.9, 307.0], [36.0, 310.0], [36.1, 312.0], [36.2, 313.0], [36.3, 317.0], [36.4, 322.0], [36.5, 334.0], [36.6, 337.0], [36.7, 338.0], [36.8, 340.0], [36.9, 345.0], [37.0, 346.0], [37.1, 352.0], [37.2, 352.0], [37.3, 357.0], [37.4, 358.0], [37.5, 368.0], [37.6, 369.0], [37.7, 380.0], [37.8, 386.0], [37.9, 387.0], [38.0, 388.0], [38.1, 392.0], [38.2, 396.0], [38.3, 401.0], [38.4, 402.0], [38.5, 412.0], [38.6, 412.0], [38.7, 420.0], [38.8, 426.0], [38.9, 430.0], [39.0, 439.0], [39.1, 443.0], [39.2, 444.0], [39.3, 447.0], [39.4, 447.0], [39.5, 452.0], [39.6, 453.0], [39.7, 456.0], [39.8, 459.0], [39.9, 460.0], [40.0, 464.0], [40.1, 466.0], [40.2, 467.0], [40.3, 475.0], [40.4, 475.0], [40.5, 476.0], [40.6, 481.0], [40.7, 486.0], [40.8, 487.0], [40.9, 490.0], [41.0, 491.0], [41.1, 493.0], [41.2, 494.0], [41.3, 503.0], [41.4, 504.0], [41.5, 510.0], [41.6, 517.0], [41.7, 519.0], [41.8, 527.0], [41.9, 531.0], [42.0, 536.0], [42.1, 541.0], [42.2, 543.0], [42.3, 548.0], [42.4, 550.0], [42.5, 555.0], [42.6, 556.0], [42.7, 558.0], [42.8, 560.0], [42.9, 563.0], [43.0, 564.0], [43.1, 567.0], [43.2, 571.0], [43.3, 575.0], [43.4, 580.0], [43.5, 585.0], [43.6, 587.0], [43.7, 593.0], [43.8, 594.0], [43.9, 602.0], [44.0, 603.0], [44.1, 607.0], [44.2, 609.0], [44.3, 615.0], [44.4, 615.0], [44.5, 627.0], [44.6, 629.0], [44.7, 630.0], [44.8, 632.0], [44.9, 635.0], [45.0, 637.0], [45.1, 644.0], [45.2, 649.0], [45.3, 654.0], [45.4, 654.0], [45.5, 657.0], [45.6, 668.0], [45.7, 674.0], [45.8, 676.0], [45.9, 684.0], [46.0, 695.0], [46.1, 699.0], [46.2, 702.0], [46.3, 706.0], [46.4, 709.0], [46.5, 716.0], [46.6, 716.0], [46.7, 727.0], [46.8, 731.0], [46.9, 733.0], [47.0, 734.0], [47.1, 744.0], [47.2, 745.0], [47.3, 754.0], [47.4, 760.0], [47.5, 772.0], [47.6, 772.0], [47.7, 775.0], [47.8, 778.0], [47.9, 778.0], [48.0, 779.0], [48.1, 781.0], [48.2, 783.0], [48.3, 790.0], [48.4, 791.0], [48.5, 798.0], [48.6, 801.0], [48.7, 806.0], [48.8, 808.0], [48.9, 810.0], [49.0, 812.0], [49.1, 819.0], [49.2, 821.0], [49.3, 830.0], [49.4, 833.0], [49.5, 837.0], [49.6, 844.0], [49.7, 854.0], [49.8, 854.0], [49.9, 859.0], [50.0, 861.0], [50.1, 879.0], [50.2, 885.0], [50.3, 892.0], [50.4, 892.0], [50.5, 899.0], [50.6, 899.0], [50.7, 901.0], [50.8, 901.0], [50.9, 907.0], [51.0, 911.0], [51.1, 912.0], [51.2, 912.0], [51.3, 913.0], [51.4, 913.0], [51.5, 915.0], [51.6, 917.0], [51.7, 920.0], [51.8, 922.0], [51.9, 926.0], [52.0, 930.0], [52.1, 934.0], [52.2, 936.0], [52.3, 945.0], [52.4, 945.0], [52.5, 951.0], [52.6, 954.0], [52.7, 955.0], [52.8, 958.0], [52.9, 963.0], [53.0, 964.0], [53.1, 976.0], [53.2, 980.0], [53.3, 994.0], [53.4, 996.0], [53.5, 998.0], [53.6, 1003.0], [53.7, 1004.0], [53.8, 1004.0], [53.9, 1008.0], [54.0, 1011.0], [54.1, 1013.0], [54.2, 1018.0], [54.3, 1024.0], [54.4, 1025.0], [54.5, 1029.0], [54.6, 1030.0], [54.7, 1039.0], [54.8, 1044.0], [54.9, 1053.0], [55.0, 1056.0], [55.1, 1058.0], [55.2, 1062.0], [55.3, 1070.0], [55.4, 1079.0], [55.5, 1083.0], [55.6, 1085.0], [55.7, 1092.0], [55.8, 1096.0], [55.9, 1114.0], [56.0, 1117.0], [56.1, 1119.0], [56.2, 1122.0], [56.3, 1129.0], [56.4, 1129.0], [56.5, 1134.0], [56.6, 1135.0], [56.7, 1143.0], [56.8, 1145.0], [56.9, 1149.0], [57.0, 1149.0], [57.1, 1154.0], [57.2, 1156.0], [57.3, 1164.0], [57.4, 1165.0], [57.5, 1166.0], [57.6, 1167.0], [57.7, 1169.0], [57.8, 1169.0], [57.9, 1170.0], [58.0, 1171.0], [58.1, 1184.0], [58.2, 1184.0], [58.3, 1191.0], [58.4, 1192.0], [58.5, 1203.0], [58.6, 1203.0], [58.7, 1208.0], [58.8, 1208.0], [58.9, 1211.0], [59.0, 1212.0], [59.1, 1214.0], [59.2, 1215.0], [59.3, 1224.0], [59.4, 1231.0], [59.5, 1235.0], [59.6, 1238.0], [59.7, 1241.0], [59.8, 1243.0], [59.9, 1253.0], [60.0, 1255.0], [60.1, 1257.0], [60.2, 1257.0], [60.3, 1261.0], [60.4, 1262.0], [60.5, 1265.0], [60.6, 1266.0], [60.7, 1271.0], [60.8, 1274.0], [60.9, 1276.0], [61.0, 1276.0], [61.1, 1281.0], [61.2, 1282.0], [61.3, 1286.0], [61.4, 1286.0], [61.5, 1290.0], [61.6, 1296.0], [61.7, 1301.0], [61.8, 1302.0], [61.9, 1309.0], [62.0, 1314.0], [62.1, 1317.0], [62.2, 1319.0], [62.3, 1324.0], [62.4, 1327.0], [62.5, 1331.0], [62.6, 1332.0], [62.7, 1339.0], [62.8, 1342.0], [62.9, 1350.0], [63.0, 1353.0], [63.1, 1353.0], [63.2, 1353.0], [63.3, 1361.0], [63.4, 1371.0], [63.5, 1375.0], [63.6, 1382.0], [63.7, 1387.0], [63.8, 1388.0], [63.9, 1390.0], [64.0, 1392.0], [64.1, 1392.0], [64.2, 1394.0], [64.3, 1397.0], [64.4, 1397.0], [64.5, 1403.0], [64.6, 1404.0], [64.7, 1414.0], [64.8, 1415.0], [64.9, 1416.0], [65.0, 1423.0], [65.1, 1427.0], [65.2, 1427.0], [65.3, 1437.0], [65.4, 1437.0], [65.5, 1440.0], [65.6, 1445.0], [65.7, 1447.0], [65.8, 1449.0], [65.9, 1456.0], [66.0, 1457.0], [66.1, 1460.0], [66.2, 1462.0], [66.3, 1467.0], [66.4, 1469.0], [66.5, 1473.0], [66.6, 1477.0], [66.7, 1485.0], [66.8, 1487.0], [66.9, 1491.0], [67.0, 1493.0], [67.1, 1494.0], [67.2, 1499.0], [67.3, 1503.0], [67.4, 1503.0], [67.5, 1512.0], [67.6, 1512.0], [67.7, 1515.0], [67.8, 1518.0], [67.9, 1521.0], [68.0, 1525.0], [68.1, 1530.0], [68.2, 1535.0], [68.3, 1536.0], [68.4, 1537.0], [68.5, 1544.0], [68.6, 1546.0], [68.7, 1548.0], [68.8, 1554.0], [68.9, 1558.0], [69.0, 1563.0], [69.1, 1569.0], [69.2, 1571.0], [69.3, 1574.0], [69.4, 1577.0], [69.5, 1579.0], [69.6, 1580.0], [69.7, 1582.0], [69.8, 1583.0], [69.9, 1584.0], [70.0, 1588.0], [70.1, 1590.0], [70.2, 1591.0], [70.3, 1592.0], [70.4, 1592.0], [70.5, 1594.0], [70.6, 1595.0], [70.7, 1599.0], [70.8, 1600.0], [70.9, 1606.0], [71.0, 1611.0], [71.1, 1616.0], [71.2, 1617.0], [71.3, 1622.0], [71.4, 1623.0], [71.5, 1626.0], [71.6, 1626.0], [71.7, 1629.0], [71.8, 1631.0], [71.9, 1635.0], [72.0, 1636.0], [72.1, 1640.0], [72.2, 1642.0], [72.3, 1645.0], [72.4, 1648.0], [72.5, 1655.0], [72.6, 1655.0], [72.7, 1660.0], [72.8, 1661.0], [72.9, 1664.0], [73.0, 1664.0], [73.1, 1669.0], [73.2, 1670.0], [73.3, 1672.0], [73.4, 1673.0], [73.5, 1679.0], [73.6, 1679.0], [73.7, 1681.0], [73.8, 1682.0], [73.9, 1685.0], [74.0, 1687.0], [74.1, 1691.0], [74.2, 1694.0], [74.3, 1698.0], [74.4, 1703.0], [74.5, 1703.0], [74.6, 1704.0], [74.7, 1705.0], [74.8, 1705.0], [74.9, 1706.0], [75.0, 1709.0], [75.1, 1712.0], [75.2, 1713.0], [75.3, 1720.0], [75.4, 1722.0], [75.5, 1724.0], [75.6, 1726.0], [75.7, 1735.0], [75.8, 1735.0], [75.9, 1739.0], [76.0, 1740.0], [76.1, 1742.0], [76.2, 1746.0], [76.3, 1752.0], [76.4, 1752.0], [76.5, 1754.0], [76.6, 1757.0], [76.7, 1763.0], [76.8, 1765.0], [76.9, 1767.0], [77.0, 1768.0], [77.1, 1777.0], [77.2, 1780.0], [77.3, 1783.0], [77.4, 1788.0], [77.5, 1791.0], [77.6, 1792.0], [77.7, 1794.0], [77.8, 1796.0], [77.9, 1804.0], [78.0, 1808.0], [78.1, 1820.0], [78.2, 1823.0], [78.3, 1828.0], [78.4, 1828.0], [78.5, 1838.0], [78.6, 1838.0], [78.7, 1839.0], [78.8, 1840.0], [78.9, 1844.0], [79.0, 1845.0], [79.1, 1851.0], [79.2, 1852.0], [79.3, 1859.0], [79.4, 1860.0], [79.5, 1867.0], [79.6, 1867.0], [79.7, 1870.0], [79.8, 1872.0], [79.9, 1873.0], [80.0, 1876.0], [80.1, 1883.0], [80.2, 1883.0], [80.3, 1889.0], [80.4, 1890.0], [80.5, 1891.0], [80.6, 1891.0], [80.7, 1897.0], [80.8, 1898.0], [80.9, 1901.0], [81.0, 1902.0], [81.1, 1905.0], [81.2, 1905.0], [81.3, 1907.0], [81.4, 1909.0], [81.5, 1916.0], [81.6, 1919.0], [81.7, 1920.0], [81.8, 1920.0], [81.9, 1924.0], [82.0, 1924.0], [82.1, 1934.0], [82.2, 1935.0], [82.3, 1940.0], [82.4, 1941.0], [82.5, 1947.0], [82.6, 1947.0], [82.7, 1950.0], [82.8, 1950.0], [82.9, 1954.0], [83.0, 1956.0], [83.1, 1959.0], [83.2, 1961.0], [83.3, 1964.0], [83.4, 1965.0], [83.5, 1967.0], [83.6, 1971.0], [83.7, 1974.0], [83.8, 1975.0], [83.9, 1978.0], [84.0, 1983.0], [84.1, 1986.0], [84.2, 1987.0], [84.3, 1999.0], [84.4, 2002.0], [84.5, 2003.0], [84.6, 2004.0], [84.7, 2008.0], [84.8, 2008.0], [84.9, 2009.0], [85.0, 2012.0], [85.1, 2014.0], [85.2, 2015.0], [85.3, 2016.0], [85.4, 2019.0], [85.5, 2025.0], [85.6, 2025.0], [85.7, 2026.0], [85.8, 2029.0], [85.9, 2036.0], [86.0, 2039.0], [86.1, 2045.0], [86.2, 2051.0], [86.3, 2058.0], [86.4, 2058.0], [86.5, 2060.0], [86.6, 2063.0], [86.7, 2064.0], [86.8, 2064.0], [86.9, 2067.0], [87.0, 2068.0], [87.1, 2072.0], [87.2, 2076.0], [87.3, 2079.0], [87.4, 2080.0], [87.5, 2087.0], [87.6, 2087.0], [87.7, 2091.0], [87.8, 2091.0], [87.9, 2096.0], [88.0, 2096.0], [88.1, 2097.0], [88.2, 2097.0], [88.3, 2100.0], [88.4, 2103.0], [88.5, 2112.0], [88.6, 2113.0], [88.7, 2132.0], [88.8, 2133.0], [88.9, 2133.0], [89.0, 2137.0], [89.1, 2147.0], [89.2, 2150.0], [89.3, 2170.0], [89.4, 2173.0], [89.5, 2176.0], [89.6, 2181.0], [89.7, 2184.0], [89.8, 2193.0], [89.9, 2201.0], [90.0, 2203.0], [90.1, 2205.0], [90.2, 2213.0], [90.3, 2226.0], [90.4, 2230.0], [90.5, 2236.0], [90.6, 2241.0], [90.7, 2245.0], [90.8, 2251.0], [90.9, 2266.0], [91.0, 2269.0], [91.1, 2281.0], [91.2, 2283.0], [91.3, 2300.0], [91.4, 2301.0], [91.5, 2311.0], [91.6, 2318.0], [91.7, 2325.0], [91.8, 2328.0], [91.9, 2335.0], [92.0, 2337.0], [92.1, 2339.0], [92.2, 2341.0], [92.3, 2361.0], [92.4, 2365.0], [92.5, 2366.0], [92.6, 2369.0], [92.7, 2380.0], [92.8, 2384.0], [92.9, 2398.0], [93.0, 2404.0], [93.1, 2427.0], [93.2, 2429.0], [93.3, 2440.0], [93.4, 2440.0], [93.5, 2458.0], [93.6, 2473.0], [93.7, 2487.0], [93.8, 2491.0], [93.9, 2526.0], [94.0, 2527.0], [94.1, 2539.0], [94.2, 2550.0], [94.3, 2564.0], [94.4, 2571.0], [94.5, 2582.0], [94.6, 2589.0], [94.7, 2641.0], [94.8, 2650.0], [94.9, 2673.0], [95.0, 2689.0], [95.1, 2693.0], [95.2, 2707.0], [95.3, 2724.0], [95.4, 2729.0], [95.5, 2737.0], [95.6, 2748.0], [95.7, 2767.0], [95.8, 2791.0], [95.9, 2816.0], [96.0, 2818.0], [96.1, 2827.0], [96.2, 2828.0], [96.3, 2852.0], [96.4, 2856.0], [96.5, 2876.0], [96.6, 2892.0], [96.7, 2919.0], [96.8, 2943.0], [96.9, 2960.0], [97.0, 2968.0], [97.1, 2980.0], [97.2, 2989.0], [97.3, 3020.0], [97.4, 3020.0], [97.5, 3041.0], [97.6, 3060.0], [97.7, 3085.0], [97.8, 3092.0], [97.9, 3115.0], [98.0, 3147.0], [98.1, 3172.0], [98.2, 3183.0], [98.3, 3216.0], [98.4, 3225.0], [98.5, 3249.0], [98.6, 3291.0], [98.7, 3324.0], [98.8, 3339.0], [98.9, 3386.0], [99.0, 3423.0], [99.1, 3514.0], [99.2, 3550.0], [99.3, 3647.0], [99.4, 3660.0], [99.5, 3704.0], [99.6, 3742.0], [99.7, 3849.0], [99.8, 3851.0], [99.9, 4196.0], [100.0, 4946.0]], "isOverall": false, "label": "Get All Properties", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 298.0, "series": [{"data": [[0.0, 298.0], [600.0, 34.0], [700.0, 36.0], [800.0, 32.0], [900.0, 43.0], [1000.0, 34.0], [1100.0, 40.0], [1200.0, 48.0], [1300.0, 42.0], [1400.0, 42.0], [1500.0, 52.0], [100.0, 181.0], [1600.0, 54.0], [1700.0, 52.0], [1800.0, 46.0], [1900.0, 52.0], [2000.0, 59.0], [2100.0, 24.0], [2300.0, 25.0], [2200.0, 21.0], [2400.0, 13.0], [2500.0, 12.0], [2600.0, 8.0], [2700.0, 11.0], [2800.0, 12.0], [2900.0, 8.0], [3000.0, 9.0], [3100.0, 6.0], [200.0, 54.0], [3300.0, 5.0], [3200.0, 6.0], [3400.0, 2.0], [3500.0, 2.0], [3700.0, 2.0], [3600.0, 4.0], [3800.0, 3.0], [3900.0, 1.0], [4100.0, 1.0], [300.0, 41.0], [4900.0, 1.0], [400.0, 45.0], [500.0, 39.0]], "isOverall": false, "label": "Get All Properties", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 4900.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 390.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 619.0, "series": [{"data": [[0.0, 619.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 390.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 491.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 6.0, "minX": 1.76360364E12, "maxY": 159.2149093351243, "series": [{"data": [[1.7636037E12, 6.0], [1.76360364E12, 159.2149093351243]], "isOverall": false, "label": "Property Fetching Test - 300 Users", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7636037E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 55.0, "minX": 1.0, "maxY": 2508.4285714285716, "series": [{"data": [[2.0, 61.0], [3.0, 69.0], [4.0, 69.0], [5.0, 61.0], [6.0, 66.0], [7.0, 64.0], [8.0, 58.0], [9.0, 91.0], [10.0, 59.0], [11.0, 65.0], [12.0, 59.0], [13.0, 64.0], [14.0, 57.0], [15.0, 58.0], [16.0, 59.0], [17.0, 62.0], [18.0, 64.0], [19.0, 58.0], [20.0, 63.0], [21.0, 64.0], [22.0, 58.0], [23.0, 61.0], [24.0, 57.0], [25.0, 63.0], [26.0, 103.66666666666667], [27.0, 59.0], [28.0, 57.0], [29.0, 59.0], [30.0, 88.0], [31.0, 63.0], [32.0, 84.25], [33.0, 85.5], [34.0, 106.0], [35.0, 93.8], [37.0, 55.0], [36.0, 60.0], [39.0, 57.0], [38.0, 66.0], [41.0, 64.0], [40.0, 65.0], [42.0, 98.0], [43.0, 61.5], [45.0, 99.66666666666667], [44.0, 59.0], [47.0, 62.0], [46.0, 59.0], [48.0, 87.5], [49.0, 60.0], [51.0, 82.0], [50.0, 59.0], [53.0, 60.0], [52.0, 62.0], [54.0, 66.0], [55.0, 66.0], [56.0, 76.33333333333333], [57.0, 92.6], [59.0, 80.33333333333333], [58.0, 73.0], [60.0, 63.666666666666664], [61.0, 94.0], [62.0, 71.25], [63.0, 92.0], [64.0, 99.16666666666667], [65.0, 113.55555555555556], [67.0, 58.0], [66.0, 59.0], [68.0, 77.66666666666667], [69.0, 103.85714285714286], [70.0, 85.75], [71.0, 68.0], [73.0, 64.5], [74.0, 82.0], [75.0, 76.83333333333333], [72.0, 65.0], [76.0, 72.0], [77.0, 60.5], [78.0, 101.0], [79.0, 82.5], [80.0, 64.0], [81.0, 109.75], [82.0, 220.4], [83.0, 98.0], [84.0, 320.3333333333333], [85.0, 122.33333333333334], [86.0, 113.0], [87.0, 335.2], [89.0, 326.75], [90.0, 255.0], [91.0, 86.0], [92.0, 93.6], [93.0, 63.5], [94.0, 78.0], [95.0, 81.25], [96.0, 73.33333333333333], [98.0, 316.20000000000005], [99.0, 320.1428571428571], [97.0, 525.5], [100.0, 551.4], [101.0, 113.0], [102.0, 231.16666666666666], [103.0, 432.0], [104.0, 182.6], [105.0, 179.2], [106.0, 89.5], [107.0, 503.1666666666667], [108.0, 77.25], [109.0, 222.57142857142856], [110.0, 90.5], [111.0, 98.0], [112.0, 78.33333333333333], [113.0, 420.59999999999997], [115.0, 224.0], [114.0, 686.3333333333334], [116.0, 281.625], [117.0, 289.0], [118.0, 93.0], [119.0, 110.0], [120.0, 390.99999999999994], [121.0, 244.16666666666669], [122.0, 85.5], [123.0, 421.84615384615387], [124.0, 235.25], [125.0, 454.2], [126.0, 393.16666666666663], [127.0, 278.1818181818182], [128.0, 110.0], [130.0, 389.6666666666667], [131.0, 61.5], [132.0, 234.72727272727275], [133.0, 88.0], [134.0, 62.0], [135.0, 272.46666666666664], [129.0, 987.0], [136.0, 82.5], [137.0, 307.7], [138.0, 494.4000000000001], [139.0, 617.4444444444445], [140.0, 434.1111111111111], [141.0, 253.4], [142.0, 78.66666666666667], [143.0, 62.0], [144.0, 421.1428571428571], [146.0, 327.9230769230769], [147.0, 188.375], [148.0, 226.75], [149.0, 61.0], [150.0, 771.125], [151.0, 851.3333333333333], [145.0, 660.3333333333334], [154.0, 267.14285714285717], [155.0, 478.3333333333333], [156.0, 621.9285714285714], [157.0, 949.1999999999999], [158.0, 639.0], [159.0, 745.4], [153.0, 693.5], [152.0, 668.6], [160.0, 697.5], [164.0, 673.2857142857142], [163.0, 378.24999999999994], [162.0, 425.7142857142857], [165.0, 523.6666666666667], [166.0, 415.0], [167.0, 1120.6666666666667], [161.0, 1575.0], [171.0, 391.06666666666666], [172.0, 482.0952380952381], [170.0, 1171.888888888889], [175.0, 610.5], [174.0, 745.9090909090909], [169.0, 1936.0], [168.0, 1092.0], [179.0, 996.0555555555554], [177.0, 1206.0], [176.0, 485.52941176470586], [183.0, 1077.3333333333333], [182.0, 1559.875], [181.0, 1346.25], [180.0, 1090.6], [178.0, 1148.0], [187.0, 1638.5925925925928], [188.0, 1958.6250000000002], [189.0, 1791.9166666666665], [191.0, 1667.1538461538462], [190.0, 1623.5], [186.0, 1216.7142857142858], [185.0, 1213.0], [184.0, 1091.0], [196.0, 1914.9642857142858], [195.0, 1641.0], [194.0, 1959.95], [193.0, 1861.5238095238094], [192.0, 1674.3999999999999], [199.0, 2160.4615384615386], [198.0, 1742.4615384615383], [197.0, 1862.75], [205.0, 1831.0666666666668], [204.0, 2154.518518518519], [202.0, 2132.636363636364], [201.0, 1793.9285714285716], [200.0, 1673.3999999999999], [207.0, 1715.2777777777776], [206.0, 1563.3846153846152], [203.0, 1520.6], [208.0, 2508.4285714285716], [215.0, 1746.695652173913], [214.0, 1933.7000000000003], [213.0, 1309.6666666666667], [212.0, 1799.8], [211.0, 1924.2], [210.0, 2475.9411764705883], [221.0, 1929.9655172413793], [220.0, 1829.7631578947367], [219.0, 1615.125], [223.0, 1883.1666666666665], [222.0, 2070.5], [218.0, 1866.5], [216.0, 1689.5], [217.0, 1869.4090909090908], [226.0, 1932.5], [225.0, 2303.947368421053], [224.0, 2249.25], [1.0, 75.0]], "isOverall": false, "label": "Get All Properties", "isController": false}, {"data": [[158.09133333333335, 1018.2899999999992]], "isOverall": false, "label": "Get All Properties-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 226.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 35.56666666666667, "minX": 1.76360364E12, "maxY": 67898.4, "series": [{"data": [[1.7636037E12, 501.6], [1.76360364E12, 67898.4]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7636037E12, 35.56666666666667], [1.76360364E12, 4814.433333333333]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7636037E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 67.0909090909091, "minX": 1.76360364E12, "maxY": 1025.3169912693077, "series": [{"data": [[1.7636037E12, 67.0909090909091], [1.76360364E12, 1025.3169912693077]], "isOverall": false, "label": "Get All Properties", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7636037E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 66.99999999999999, "minX": 1.76360364E12, "maxY": 1025.2135661517814, "series": [{"data": [[1.7636037E12, 66.99999999999999], [1.76360364E12, 1025.2135661517814]], "isOverall": false, "label": "Get All Properties", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7636037E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.0, "minX": 1.76360364E12, "maxY": 9.801880456682373, "series": [{"data": [[1.7636037E12, 0.0], [1.76360364E12, 9.801880456682373]], "isOverall": false, "label": "Get All Properties", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7636037E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 55.0, "minX": 1.76360364E12, "maxY": 4946.0, "series": [{"data": [[1.7636037E12, 91.0], [1.76360364E12, 4946.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7636037E12, 58.0], [1.76360364E12, 55.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7636037E12, 87.80000000000001], [1.76360364E12, 2205.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7636037E12, 91.0], [1.76360364E12, 3450.9999999999936]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7636037E12, 65.0], [1.76360364E12, 892.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.7636037E12, 91.0], [1.76360364E12, 2692.5]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7636037E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 59.0, "minX": 1.0, "maxY": 2013.5, "series": [{"data": [[33.0, 66.0], [32.0, 2013.5], [34.0, 93.0], [35.0, 1493.0], [36.0, 100.5], [37.0, 430.0], [39.0, 934.0], [38.0, 630.5], [41.0, 1626.0], [40.0, 1794.0], [43.0, 1441.0], [42.0, 704.0], [45.0, 1945.0], [44.0, 1618.5], [47.0, 856.0], [48.0, 1868.5], [3.0, 69.0], [56.0, 1632.0], [4.0, 119.0], [6.0, 109.5], [11.0, 59.5], [13.0, 111.0], [16.0, 111.5], [1.0, 68.0], [17.0, 109.0], [18.0, 62.0], [19.0, 59.0], [21.0, 91.0], [24.0, 62.5], [25.0, 1116.0], [27.0, 1056.0], [28.0, 75.0], [29.0, 122.5], [30.0, 1701.5], [31.0, 115.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 56.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 59.0, "minX": 1.0, "maxY": 2013.5, "series": [{"data": [[33.0, 66.0], [32.0, 2013.5], [34.0, 92.0], [35.0, 1493.0], [36.0, 100.5], [37.0, 430.0], [39.0, 934.0], [38.0, 630.5], [41.0, 1626.0], [40.0, 1793.5], [43.0, 1441.0], [42.0, 704.0], [45.0, 1945.0], [44.0, 1618.5], [47.0, 856.0], [48.0, 1868.5], [3.0, 69.0], [56.0, 1632.0], [4.0, 119.0], [6.0, 109.5], [11.0, 59.5], [13.0, 111.0], [16.0, 111.5], [1.0, 68.0], [17.0, 109.0], [18.0, 62.0], [19.0, 59.0], [21.0, 91.0], [24.0, 62.0], [25.0, 1115.5], [27.0, 1056.0], [28.0, 75.0], [29.0, 122.5], [30.0, 1701.5], [31.0, 115.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 56.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 0.16666666666666666, "minX": 1.76360364E12, "maxY": 24.833333333333332, "series": [{"data": [[1.7636037E12, 0.16666666666666666], [1.76360364E12, 24.833333333333332]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7636037E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 0.18333333333333332, "minX": 1.76360364E12, "maxY": 24.816666666666666, "series": [{"data": [[1.7636037E12, 0.18333333333333332], [1.76360364E12, 24.816666666666666]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7636037E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 0.18333333333333332, "minX": 1.76360364E12, "maxY": 24.816666666666666, "series": [{"data": [[1.7636037E12, 0.18333333333333332], [1.76360364E12, 24.816666666666666]], "isOverall": false, "label": "Get All Properties-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7636037E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 0.18333333333333332, "minX": 1.76360364E12, "maxY": 24.816666666666666, "series": [{"data": [[1.7636037E12, 0.18333333333333332], [1.76360364E12, 24.816666666666666]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7636037E12, "title": "Total Transactions Per Second"}},
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

