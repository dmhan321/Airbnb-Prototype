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
        data: {"result": {"minY": 247.0, "minX": 0.0, "maxY": 6277.0, "series": [{"data": [[0.0, 247.0], [0.1, 247.0], [0.2, 247.0], [0.3, 247.0], [0.4, 249.0], [0.5, 249.0], [0.6, 249.0], [0.7, 250.0], [0.8, 250.0], [0.9, 250.0], [1.0, 252.0], [1.1, 252.0], [1.2, 252.0], [1.3, 252.0], [1.4, 263.0], [1.5, 263.0], [1.6, 263.0], [1.7, 264.0], [1.8, 264.0], [1.9, 264.0], [2.0, 265.0], [2.1, 265.0], [2.2, 265.0], [2.3, 265.0], [2.4, 265.0], [2.5, 265.0], [2.6, 265.0], [2.7, 270.0], [2.8, 270.0], [2.9, 270.0], [3.0, 278.0], [3.1, 278.0], [3.2, 278.0], [3.3, 278.0], [3.4, 280.0], [3.5, 280.0], [3.6, 280.0], [3.7, 280.0], [3.8, 280.0], [3.9, 280.0], [4.0, 286.0], [4.1, 286.0], [4.2, 286.0], [4.3, 286.0], [4.4, 287.0], [4.5, 287.0], [4.6, 287.0], [4.7, 288.0], [4.8, 288.0], [4.9, 288.0], [5.0, 291.0], [5.1, 291.0], [5.2, 291.0], [5.3, 291.0], [5.4, 293.0], [5.5, 293.0], [5.6, 293.0], [5.7, 330.0], [5.8, 330.0], [5.9, 330.0], [6.0, 344.0], [6.1, 344.0], [6.2, 344.0], [6.3, 344.0], [6.4, 363.0], [6.5, 363.0], [6.6, 363.0], [6.7, 367.0], [6.8, 367.0], [6.9, 367.0], [7.0, 372.0], [7.1, 372.0], [7.2, 372.0], [7.3, 372.0], [7.4, 372.0], [7.5, 372.0], [7.6, 372.0], [7.7, 381.0], [7.8, 381.0], [7.9, 381.0], [8.0, 383.0], [8.1, 383.0], [8.2, 383.0], [8.3, 383.0], [8.4, 391.0], [8.5, 391.0], [8.6, 391.0], [8.7, 397.0], [8.8, 397.0], [8.9, 397.0], [9.0, 409.0], [9.1, 409.0], [9.2, 409.0], [9.3, 409.0], [9.4, 443.0], [9.5, 443.0], [9.6, 443.0], [9.7, 447.0], [9.8, 447.0], [9.9, 447.0], [10.0, 460.0], [10.1, 460.0], [10.2, 460.0], [10.3, 460.0], [10.4, 476.0], [10.5, 476.0], [10.6, 476.0], [10.7, 546.0], [10.8, 546.0], [10.9, 546.0], [11.0, 546.0], [11.1, 550.0], [11.2, 550.0], [11.3, 550.0], [11.4, 552.0], [11.5, 552.0], [11.6, 552.0], [11.7, 559.0], [11.8, 559.0], [11.9, 559.0], [12.0, 559.0], [12.1, 565.0], [12.2, 565.0], [12.3, 565.0], [12.4, 567.0], [12.5, 567.0], [12.6, 567.0], [12.7, 569.0], [12.8, 569.0], [12.9, 569.0], [13.0, 569.0], [13.1, 576.0], [13.2, 576.0], [13.3, 576.0], [13.4, 581.0], [13.5, 581.0], [13.6, 581.0], [13.7, 586.0], [13.8, 586.0], [13.9, 586.0], [14.0, 586.0], [14.1, 588.0], [14.2, 588.0], [14.3, 588.0], [14.4, 645.0], [14.5, 645.0], [14.6, 645.0], [14.7, 688.0], [14.8, 688.0], [14.9, 688.0], [15.0, 688.0], [15.1, 691.0], [15.2, 691.0], [15.3, 691.0], [15.4, 747.0], [15.5, 747.0], [15.6, 747.0], [15.7, 747.0], [15.8, 747.0], [15.9, 747.0], [16.0, 747.0], [16.1, 750.0], [16.2, 750.0], [16.3, 750.0], [16.4, 756.0], [16.5, 756.0], [16.6, 756.0], [16.7, 757.0], [16.8, 757.0], [16.9, 757.0], [17.0, 757.0], [17.1, 760.0], [17.2, 760.0], [17.3, 760.0], [17.4, 761.0], [17.5, 761.0], [17.6, 761.0], [17.7, 767.0], [17.8, 767.0], [17.9, 767.0], [18.0, 767.0], [18.1, 777.0], [18.2, 777.0], [18.3, 777.0], [18.4, 778.0], [18.5, 778.0], [18.6, 778.0], [18.7, 781.0], [18.8, 781.0], [18.9, 781.0], [19.0, 782.0], [19.1, 782.0], [19.2, 782.0], [19.3, 782.0], [19.4, 849.0], [19.5, 849.0], [19.6, 849.0], [19.7, 851.0], [19.8, 851.0], [19.9, 851.0], [20.0, 859.0], [20.1, 859.0], [20.2, 859.0], [20.3, 859.0], [20.4, 860.0], [20.5, 860.0], [20.6, 860.0], [20.7, 860.0], [20.8, 860.0], [20.9, 860.0], [21.0, 869.0], [21.1, 869.0], [21.2, 869.0], [21.3, 869.0], [21.4, 869.0], [21.5, 869.0], [21.6, 869.0], [21.7, 870.0], [21.8, 870.0], [21.9, 870.0], [22.0, 874.0], [22.1, 874.0], [22.2, 874.0], [22.3, 874.0], [22.4, 880.0], [22.5, 880.0], [22.6, 880.0], [22.7, 947.0], [22.8, 947.0], [22.9, 947.0], [23.0, 950.0], [23.1, 950.0], [23.2, 950.0], [23.3, 950.0], [23.4, 959.0], [23.5, 959.0], [23.6, 959.0], [23.7, 966.0], [23.8, 966.0], [23.9, 966.0], [24.0, 971.0], [24.1, 971.0], [24.2, 971.0], [24.3, 971.0], [24.4, 976.0], [24.5, 976.0], [24.6, 976.0], [24.7, 987.0], [24.8, 987.0], [24.9, 987.0], [25.0, 987.0], [25.1, 987.0], [25.2, 987.0], [25.3, 987.0], [25.4, 1046.0], [25.5, 1046.0], [25.6, 1046.0], [25.7, 1052.0], [25.8, 1052.0], [25.9, 1052.0], [26.0, 1052.0], [26.1, 1052.0], [26.2, 1052.0], [26.3, 1052.0], [26.4, 1074.0], [26.5, 1074.0], [26.6, 1074.0], [26.7, 1081.0], [26.8, 1081.0], [26.9, 1081.0], [27.0, 1084.0], [27.1, 1084.0], [27.2, 1084.0], [27.3, 1084.0], [27.4, 1085.0], [27.5, 1085.0], [27.6, 1085.0], [27.7, 1087.0], [27.8, 1087.0], [27.9, 1087.0], [28.0, 1100.0], [28.1, 1100.0], [28.2, 1100.0], [28.3, 1100.0], [28.4, 1100.0], [28.5, 1100.0], [28.6, 1100.0], [28.7, 1140.0], [28.8, 1140.0], [28.9, 1140.0], [29.0, 1144.0], [29.1, 1144.0], [29.2, 1144.0], [29.3, 1144.0], [29.4, 1145.0], [29.5, 1145.0], [29.6, 1145.0], [29.7, 1157.0], [29.8, 1157.0], [29.9, 1157.0], [30.0, 1157.0], [30.1, 1157.0], [30.2, 1157.0], [30.3, 1157.0], [30.4, 1161.0], [30.5, 1161.0], [30.6, 1161.0], [30.7, 1173.0], [30.8, 1173.0], [30.9, 1173.0], [31.0, 1177.0], [31.1, 1177.0], [31.2, 1177.0], [31.3, 1177.0], [31.4, 1178.0], [31.5, 1178.0], [31.6, 1178.0], [31.7, 1178.0], [31.8, 1178.0], [31.9, 1178.0], [32.0, 1181.0], [32.1, 1181.0], [32.2, 1181.0], [32.3, 1181.0], [32.4, 1183.0], [32.5, 1183.0], [32.6, 1183.0], [32.7, 1188.0], [32.8, 1188.0], [32.9, 1188.0], [33.0, 1189.0], [33.1, 1189.0], [33.2, 1189.0], [33.3, 1189.0], [33.4, 1248.0], [33.5, 1248.0], [33.6, 1248.0], [33.7, 1255.0], [33.8, 1255.0], [33.9, 1255.0], [34.0, 1264.0], [34.1, 1264.0], [34.2, 1264.0], [34.3, 1264.0], [34.4, 1268.0], [34.5, 1268.0], [34.6, 1268.0], [34.7, 1273.0], [34.8, 1273.0], [34.9, 1273.0], [35.0, 1275.0], [35.1, 1275.0], [35.2, 1275.0], [35.3, 1275.0], [35.4, 1276.0], [35.5, 1276.0], [35.6, 1276.0], [35.7, 1278.0], [35.8, 1278.0], [35.9, 1278.0], [36.0, 1278.0], [36.1, 1281.0], [36.2, 1281.0], [36.3, 1281.0], [36.4, 1281.0], [36.5, 1281.0], [36.6, 1281.0], [36.7, 1282.0], [36.8, 1282.0], [36.9, 1282.0], [37.0, 1282.0], [37.1, 1283.0], [37.2, 1283.0], [37.3, 1283.0], [37.4, 1291.0], [37.5, 1291.0], [37.6, 1291.0], [37.7, 1346.0], [37.8, 1346.0], [37.9, 1346.0], [38.0, 1346.0], [38.1, 1353.0], [38.2, 1353.0], [38.3, 1353.0], [38.4, 1355.0], [38.5, 1355.0], [38.6, 1355.0], [38.7, 1355.0], [38.8, 1355.0], [38.9, 1355.0], [39.0, 1355.0], [39.1, 1366.0], [39.2, 1366.0], [39.3, 1366.0], [39.4, 1375.0], [39.5, 1375.0], [39.6, 1375.0], [39.7, 1379.0], [39.8, 1379.0], [39.9, 1379.0], [40.0, 1379.0], [40.1, 1381.0], [40.2, 1381.0], [40.3, 1381.0], [40.4, 1381.0], [40.5, 1381.0], [40.6, 1381.0], [40.7, 1382.0], [40.8, 1382.0], [40.9, 1382.0], [41.0, 1382.0], [41.1, 1386.0], [41.2, 1386.0], [41.3, 1386.0], [41.4, 1389.0], [41.5, 1389.0], [41.6, 1389.0], [41.7, 1396.0], [41.8, 1396.0], [41.9, 1396.0], [42.0, 1396.0], [42.1, 1442.0], [42.2, 1442.0], [42.3, 1442.0], [42.4, 1444.0], [42.5, 1444.0], [42.6, 1444.0], [42.7, 1447.0], [42.8, 1447.0], [42.9, 1447.0], [43.0, 1447.0], [43.1, 1450.0], [43.2, 1450.0], [43.3, 1450.0], [43.4, 1452.0], [43.5, 1452.0], [43.6, 1452.0], [43.7, 1454.0], [43.8, 1454.0], [43.9, 1454.0], [44.0, 1454.0], [44.1, 1455.0], [44.2, 1455.0], [44.3, 1455.0], [44.4, 1457.0], [44.5, 1457.0], [44.6, 1457.0], [44.7, 1459.0], [44.8, 1459.0], [44.9, 1459.0], [45.0, 1459.0], [45.1, 1472.0], [45.2, 1472.0], [45.3, 1472.0], [45.4, 1480.0], [45.5, 1480.0], [45.6, 1480.0], [45.7, 1480.0], [45.8, 1480.0], [45.9, 1480.0], [46.0, 1480.0], [46.1, 1483.0], [46.2, 1483.0], [46.3, 1483.0], [46.4, 1483.0], [46.5, 1483.0], [46.6, 1483.0], [46.7, 1485.0], [46.8, 1485.0], [46.9, 1485.0], [47.0, 1485.0], [47.1, 1486.0], [47.2, 1486.0], [47.3, 1486.0], [47.4, 1487.0], [47.5, 1487.0], [47.6, 1487.0], [47.7, 1488.0], [47.8, 1488.0], [47.9, 1488.0], [48.0, 1488.0], [48.1, 1549.0], [48.2, 1549.0], [48.3, 1549.0], [48.4, 1551.0], [48.5, 1551.0], [48.6, 1551.0], [48.7, 1554.0], [48.8, 1554.0], [48.9, 1554.0], [49.0, 1554.0], [49.1, 1564.0], [49.2, 1564.0], [49.3, 1564.0], [49.4, 1565.0], [49.5, 1565.0], [49.6, 1565.0], [49.7, 1569.0], [49.8, 1569.0], [49.9, 1569.0], [50.0, 1569.0], [50.1, 1574.0], [50.2, 1574.0], [50.3, 1574.0], [50.4, 1578.0], [50.5, 1578.0], [50.6, 1578.0], [50.7, 1583.0], [50.8, 1583.0], [50.9, 1583.0], [51.0, 1583.0], [51.1, 1589.0], [51.2, 1589.0], [51.3, 1589.0], [51.4, 1591.0], [51.5, 1591.0], [51.6, 1591.0], [51.7, 1642.0], [51.8, 1642.0], [51.9, 1642.0], [52.0, 1642.0], [52.1, 1644.0], [52.2, 1644.0], [52.3, 1644.0], [52.4, 1651.0], [52.5, 1651.0], [52.6, 1651.0], [52.7, 1657.0], [52.8, 1657.0], [52.9, 1657.0], [53.0, 1657.0], [53.1, 1671.0], [53.2, 1671.0], [53.3, 1671.0], [53.4, 1677.0], [53.5, 1677.0], [53.6, 1677.0], [53.7, 1682.0], [53.8, 1682.0], [53.9, 1682.0], [54.0, 1682.0], [54.1, 1688.0], [54.2, 1688.0], [54.3, 1688.0], [54.4, 1690.0], [54.5, 1690.0], [54.6, 1690.0], [54.7, 1755.0], [54.8, 1755.0], [54.9, 1755.0], [55.0, 1755.0], [55.1, 1757.0], [55.2, 1757.0], [55.3, 1757.0], [55.4, 1830.0], [55.5, 1830.0], [55.6, 1830.0], [55.7, 1848.0], [55.8, 1848.0], [55.9, 1848.0], [56.0, 1848.0], [56.1, 1851.0], [56.2, 1851.0], [56.3, 1851.0], [56.4, 1869.0], [56.5, 1869.0], [56.6, 1869.0], [56.7, 1871.0], [56.8, 1871.0], [56.9, 1871.0], [57.0, 1871.0], [57.1, 1880.0], [57.2, 1880.0], [57.3, 1880.0], [57.4, 1890.0], [57.5, 1890.0], [57.6, 1890.0], [57.7, 1967.0], [57.8, 1967.0], [57.9, 1967.0], [58.0, 1967.0], [58.1, 1970.0], [58.2, 1970.0], [58.3, 1970.0], [58.4, 1981.0], [58.5, 1981.0], [58.6, 1981.0], [58.7, 2083.0], [58.8, 2083.0], [58.9, 2083.0], [59.0, 2083.0], [59.1, 2147.0], [59.2, 2147.0], [59.3, 2147.0], [59.4, 2158.0], [59.5, 2158.0], [59.6, 2158.0], [59.7, 2184.0], [59.8, 2184.0], [59.9, 2184.0], [60.0, 2184.0], [60.1, 2254.0], [60.2, 2254.0], [60.3, 2254.0], [60.4, 2266.0], [60.5, 2266.0], [60.6, 2266.0], [60.7, 2276.0], [60.8, 2276.0], [60.9, 2276.0], [61.0, 2276.0], [61.1, 2347.0], [61.2, 2347.0], [61.3, 2347.0], [61.4, 2385.0], [61.5, 2385.0], [61.6, 2385.0], [61.7, 2477.0], [61.8, 2477.0], [61.9, 2477.0], [62.0, 2477.0], [62.1, 2486.0], [62.2, 2486.0], [62.3, 2486.0], [62.4, 2487.0], [62.5, 2487.0], [62.6, 2487.0], [62.7, 2551.0], [62.8, 2551.0], [62.9, 2551.0], [63.0, 2551.0], [63.1, 2555.0], [63.2, 2555.0], [63.3, 2555.0], [63.4, 2647.0], [63.5, 2647.0], [63.6, 2647.0], [63.7, 2675.0], [63.8, 2675.0], [63.9, 2675.0], [64.0, 2675.0], [64.1, 2774.0], [64.2, 2774.0], [64.3, 2774.0], [64.4, 2846.0], [64.5, 2846.0], [64.6, 2846.0], [64.7, 2847.0], [64.8, 2847.0], [64.9, 2847.0], [65.0, 2847.0], [65.1, 2853.0], [65.2, 2853.0], [65.3, 2853.0], [65.4, 2879.0], [65.5, 2879.0], [65.6, 2879.0], [65.7, 2898.0], [65.8, 2898.0], [65.9, 2898.0], [66.0, 2898.0], [66.1, 2940.0], [66.2, 2940.0], [66.3, 2940.0], [66.4, 2951.0], [66.5, 2951.0], [66.6, 2951.0], [66.7, 2969.0], [66.8, 2969.0], [66.9, 2969.0], [67.0, 2969.0], [67.1, 2970.0], [67.2, 2970.0], [67.3, 2970.0], [67.4, 3046.0], [67.5, 3046.0], [67.6, 3046.0], [67.7, 3049.0], [67.8, 3049.0], [67.9, 3049.0], [68.0, 3049.0], [68.1, 3058.0], [68.2, 3058.0], [68.3, 3058.0], [68.4, 3062.0], [68.5, 3062.0], [68.6, 3062.0], [68.7, 3073.0], [68.8, 3073.0], [68.9, 3073.0], [69.0, 3073.0], [69.1, 3145.0], [69.2, 3145.0], [69.3, 3145.0], [69.4, 3146.0], [69.5, 3146.0], [69.6, 3146.0], [69.7, 3192.0], [69.8, 3192.0], [69.9, 3192.0], [70.0, 3192.0], [70.1, 3247.0], [70.2, 3247.0], [70.3, 3247.0], [70.4, 3252.0], [70.5, 3252.0], [70.6, 3252.0], [70.7, 3261.0], [70.8, 3261.0], [70.9, 3261.0], [71.0, 3261.0], [71.1, 3292.0], [71.2, 3292.0], [71.3, 3292.0], [71.4, 3350.0], [71.5, 3350.0], [71.6, 3350.0], [71.7, 3365.0], [71.8, 3365.0], [71.9, 3365.0], [72.0, 3365.0], [72.1, 3462.0], [72.2, 3462.0], [72.3, 3462.0], [72.4, 3464.0], [72.5, 3464.0], [72.6, 3464.0], [72.7, 3468.0], [72.8, 3468.0], [72.9, 3468.0], [73.0, 3468.0], [73.1, 3472.0], [73.2, 3472.0], [73.3, 3472.0], [73.4, 3490.0], [73.5, 3490.0], [73.6, 3490.0], [73.7, 3543.0], [73.8, 3543.0], [73.9, 3543.0], [74.0, 3543.0], [74.1, 3546.0], [74.2, 3546.0], [74.3, 3546.0], [74.4, 3549.0], [74.5, 3549.0], [74.6, 3549.0], [74.7, 3558.0], [74.8, 3558.0], [74.9, 3558.0], [75.0, 3558.0], [75.1, 3558.0], [75.2, 3558.0], [75.3, 3558.0], [75.4, 3563.0], [75.5, 3563.0], [75.6, 3563.0], [75.7, 3566.0], [75.8, 3566.0], [75.9, 3566.0], [76.0, 3566.0], [76.1, 3568.0], [76.2, 3568.0], [76.3, 3568.0], [76.4, 3570.0], [76.5, 3570.0], [76.6, 3570.0], [76.7, 3588.0], [76.8, 3588.0], [76.9, 3588.0], [77.0, 3589.0], [77.1, 3589.0], [77.2, 3589.0], [77.3, 3589.0], [77.4, 3645.0], [77.5, 3645.0], [77.6, 3645.0], [77.7, 3648.0], [77.8, 3648.0], [77.9, 3648.0], [78.0, 3653.0], [78.1, 3653.0], [78.2, 3653.0], [78.3, 3653.0], [78.4, 3656.0], [78.5, 3656.0], [78.6, 3656.0], [78.7, 3663.0], [78.8, 3663.0], [78.9, 3663.0], [79.0, 3675.0], [79.1, 3675.0], [79.2, 3675.0], [79.3, 3675.0], [79.4, 3682.0], [79.5, 3682.0], [79.6, 3682.0], [79.7, 3687.0], [79.8, 3687.0], [79.9, 3687.0], [80.0, 3690.0], [80.1, 3690.0], [80.2, 3690.0], [80.3, 3690.0], [80.4, 3691.0], [80.5, 3691.0], [80.6, 3691.0], [80.7, 3752.0], [80.8, 3752.0], [80.9, 3752.0], [81.0, 3758.0], [81.1, 3758.0], [81.2, 3758.0], [81.3, 3758.0], [81.4, 3761.0], [81.5, 3761.0], [81.6, 3761.0], [81.7, 3764.0], [81.8, 3764.0], [81.9, 3764.0], [82.0, 3785.0], [82.1, 3785.0], [82.2, 3785.0], [82.3, 3785.0], [82.4, 3801.0], [82.5, 3801.0], [82.6, 3801.0], [82.7, 3851.0], [82.8, 3851.0], [82.9, 3851.0], [83.0, 3853.0], [83.1, 3853.0], [83.2, 3853.0], [83.3, 3853.0], [83.4, 3855.0], [83.5, 3855.0], [83.6, 3855.0], [83.7, 3903.0], [83.8, 3903.0], [83.9, 3903.0], [84.0, 3950.0], [84.1, 3950.0], [84.2, 3950.0], [84.3, 3950.0], [84.4, 3951.0], [84.5, 3951.0], [84.6, 3951.0], [84.7, 3956.0], [84.8, 3956.0], [84.9, 3956.0], [85.0, 3967.0], [85.1, 3967.0], [85.2, 3967.0], [85.3, 3967.0], [85.4, 4001.0], [85.5, 4001.0], [85.6, 4001.0], [85.7, 4051.0], [85.8, 4051.0], [85.9, 4051.0], [86.0, 4059.0], [86.1, 4059.0], [86.2, 4059.0], [86.3, 4059.0], [86.4, 4060.0], [86.5, 4060.0], [86.6, 4060.0], [86.7, 4080.0], [86.8, 4080.0], [86.9, 4080.0], [87.0, 4104.0], [87.1, 4104.0], [87.2, 4104.0], [87.3, 4104.0], [87.4, 4151.0], [87.5, 4151.0], [87.6, 4151.0], [87.7, 4151.0], [87.8, 4151.0], [87.9, 4151.0], [88.0, 4158.0], [88.1, 4158.0], [88.2, 4158.0], [88.3, 4158.0], [88.4, 4189.0], [88.5, 4189.0], [88.6, 4189.0], [88.7, 4192.0], [88.8, 4192.0], [88.9, 4192.0], [89.0, 4202.0], [89.1, 4202.0], [89.2, 4202.0], [89.3, 4202.0], [89.4, 4258.0], [89.5, 4258.0], [89.6, 4258.0], [89.7, 4264.0], [89.8, 4264.0], [89.9, 4264.0], [90.0, 4268.0], [90.1, 4268.0], [90.2, 4268.0], [90.3, 4268.0], [90.4, 4287.0], [90.5, 4287.0], [90.6, 4287.0], [90.7, 4287.0], [90.8, 4287.0], [90.9, 4287.0], [91.0, 4348.0], [91.1, 4348.0], [91.2, 4348.0], [91.3, 4348.0], [91.4, 4358.0], [91.5, 4358.0], [91.6, 4358.0], [91.7, 4367.0], [91.8, 4367.0], [91.9, 4367.0], [92.0, 4369.0], [92.1, 4369.0], [92.2, 4369.0], [92.3, 4369.0], [92.4, 4460.0], [92.5, 4460.0], [92.6, 4460.0], [92.7, 4502.0], [92.8, 4502.0], [92.9, 4502.0], [93.0, 4551.0], [93.1, 4551.0], [93.2, 4551.0], [93.3, 4551.0], [93.4, 4554.0], [93.5, 4554.0], [93.6, 4554.0], [93.7, 4563.0], [93.8, 4563.0], [93.9, 4563.0], [94.0, 4564.0], [94.1, 4564.0], [94.2, 4564.0], [94.3, 4564.0], [94.4, 4602.0], [94.5, 4602.0], [94.6, 4602.0], [94.7, 4638.0], [94.8, 4638.0], [94.9, 4638.0], [95.0, 4644.0], [95.1, 4644.0], [95.2, 4644.0], [95.3, 4644.0], [95.4, 4656.0], [95.5, 4656.0], [95.6, 4656.0], [95.7, 4661.0], [95.8, 4661.0], [95.9, 4661.0], [96.0, 4668.0], [96.1, 4668.0], [96.2, 4668.0], [96.3, 4668.0], [96.4, 4687.0], [96.5, 4687.0], [96.6, 4687.0], [96.7, 4760.0], [96.8, 4760.0], [96.9, 4760.0], [97.0, 4801.0], [97.1, 4801.0], [97.2, 4801.0], [97.3, 4801.0], [97.4, 4884.0], [97.5, 4884.0], [97.6, 4884.0], [97.7, 4890.0], [97.8, 4890.0], [97.9, 4890.0], [98.0, 4964.0], [98.1, 4964.0], [98.2, 4964.0], [98.3, 4964.0], [98.4, 5089.0], [98.5, 5089.0], [98.6, 5089.0], [98.7, 5090.0], [98.8, 5090.0], [98.9, 5090.0], [99.0, 5564.0], [99.1, 5564.0], [99.2, 5564.0], [99.3, 5564.0], [99.4, 5942.0], [99.5, 5942.0], [99.6, 5942.0], [99.7, 6277.0], [99.8, 6277.0], [99.9, 6277.0]], "isOverall": false, "label": "Login Traveler", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 200.0, "maxY": 18.0, "series": [{"data": [[600.0, 3.0], [700.0, 12.0], [800.0, 10.0], [900.0, 8.0], [1000.0, 8.0], [1100.0, 16.0], [1200.0, 13.0], [1300.0, 13.0], [1400.0, 18.0], [1500.0, 11.0], [1600.0, 9.0], [1700.0, 2.0], [1800.0, 7.0], [1900.0, 3.0], [2000.0, 1.0], [2100.0, 3.0], [2300.0, 2.0], [2200.0, 3.0], [2400.0, 3.0], [2500.0, 2.0], [2600.0, 2.0], [2800.0, 5.0], [2700.0, 1.0], [2900.0, 4.0], [3000.0, 5.0], [3100.0, 3.0], [3300.0, 2.0], [3200.0, 4.0], [3400.0, 5.0], [3500.0, 11.0], [3700.0, 5.0], [3600.0, 10.0], [3800.0, 4.0], [3900.0, 5.0], [4000.0, 5.0], [4300.0, 4.0], [4200.0, 6.0], [4100.0, 6.0], [4600.0, 7.0], [4500.0, 5.0], [4400.0, 1.0], [4800.0, 3.0], [4700.0, 1.0], [5000.0, 2.0], [4900.0, 1.0], [5500.0, 1.0], [5900.0, 1.0], [6200.0, 1.0], [200.0, 17.0], [300.0, 10.0], [400.0, 5.0], [500.0, 11.0]], "isOverall": false, "label": "Login Traveler", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 6200.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 32.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 156.0, "series": [{"data": [[0.0, 32.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 112.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 156.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 11.6625, "minX": 1.76360334E12, "maxY": 23.91818181818183, "series": [{"data": [[1.7636034E12, 23.91818181818183], [1.76360334E12, 11.6625]], "isOverall": false, "label": "Authentication Test - 300 Users", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7636034E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 443.0, "minX": 1.0, "maxY": 4105.5, "series": [{"data": [[32.0, 2162.75], [33.0, 4105.5], [2.0, 3761.0], [4.0, 1141.857142857143], [5.0, 443.0], [6.0, 542.6666666666666], [7.0, 589.2], [8.0, 724.3333333333334], [9.0, 917.25], [10.0, 807.8], [11.0, 1048.5], [12.0, 2855.0625], [13.0, 1255.375], [14.0, 1468.3333333333333], [15.0, 2201.222222222222], [16.0, 1484.5714285714284], [1.0, 3956.0], [17.0, 1236.0], [18.0, 2130.8571428571427], [19.0, 2178.5], [20.0, 1308.625], [21.0, 1994.9411764705892], [22.0, 2687.7999999999997], [23.0, 1868.666666666667], [24.0, 2112.529411764706], [25.0, 3030.1818181818185], [26.0, 2381.392857142858], [27.0, 2878.5625], [28.0, 2742.235294117647], [29.0, 1819.9374999999998], [30.0, 3122.2222222222226]], "isOverall": false, "label": "Login Traveler", "isController": false}, {"data": [[20.64999999999998, 2152.716666666668]], "isOverall": false, "label": "Login Traveler-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 33.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 455.85, "minX": 1.76360334E12, "maxY": 3501.0333333333333, "series": [{"data": [[1.7636034E12, 3501.0333333333333], [1.76360334E12, 1270.3666666666666]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7636034E12, 1257.35], [1.76360334E12, 455.85]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7636034E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 1028.5249999999996, "minX": 1.76360334E12, "maxY": 2561.513636363633, "series": [{"data": [[1.7636034E12, 2561.513636363633], [1.76360334E12, 1028.5249999999996]], "isOverall": false, "label": "Login Traveler", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7636034E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 1028.325, "minX": 1.76360334E12, "maxY": 2561.468181818183, "series": [{"data": [[1.7636034E12, 2561.468181818183], [1.76360334E12, 1028.325]], "isOverall": false, "label": "Login Traveler", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7636034E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 49.26363636363637, "minX": 1.76360334E12, "maxY": 49.38750000000001, "series": [{"data": [[1.7636034E12, 49.26363636363637], [1.76360334E12, 49.38750000000001]], "isOverall": false, "label": "Login Traveler", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7636034E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 247.0, "minX": 1.76360334E12, "maxY": 6277.0, "series": [{"data": [[1.7636034E12, 6277.0], [1.76360334E12, 2347.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7636034E12, 249.0], [1.76360334E12, 247.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7636034E12, 4497.8], [1.76360334E12, 1748.5000000000005]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7636034E12, 5862.619999999997], [1.76360334E12, 2347.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7636034E12, 2601.0], [1.76360334E12, 1025.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.7636034E12, 4686.05], [1.76360334E12, 1889.5]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7636034E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 1101.5, "minX": 3.0, "maxY": 4687.0, "series": [{"data": [[4.0, 1101.5], [8.0, 1313.5], [17.0, 3568.0], [9.0, 1583.0], [10.0, 1228.0], [11.0, 1282.0], [6.0, 1138.5], [12.0, 3467.5], [3.0, 4687.0], [13.0, 3145.0], [7.0, 1644.0], [14.0, 2317.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 17.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 1101.5, "minX": 3.0, "maxY": 4687.0, "series": [{"data": [[4.0, 1101.5], [8.0, 1313.5], [17.0, 3568.0], [9.0, 1583.0], [10.0, 1228.0], [11.0, 1282.0], [6.0, 1138.0], [12.0, 3467.5], [3.0, 4687.0], [13.0, 3145.0], [7.0, 1644.0], [14.0, 2317.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 17.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 1.6333333333333333, "minX": 1.76360334E12, "maxY": 3.3666666666666667, "series": [{"data": [[1.7636034E12, 3.3666666666666667], [1.76360334E12, 1.6333333333333333]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7636034E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 1.3333333333333333, "minX": 1.76360334E12, "maxY": 3.6666666666666665, "series": [{"data": [[1.7636034E12, 3.6666666666666665], [1.76360334E12, 1.3333333333333333]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7636034E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 1.3333333333333333, "minX": 1.76360334E12, "maxY": 3.6666666666666665, "series": [{"data": [[1.7636034E12, 3.6666666666666665], [1.76360334E12, 1.3333333333333333]], "isOverall": false, "label": "Login Traveler-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7636034E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 1.3333333333333333, "minX": 1.76360334E12, "maxY": 3.6666666666666665, "series": [{"data": [[1.7636034E12, 3.6666666666666665], [1.76360334E12, 1.3333333333333333]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7636034E12, "title": "Total Transactions Per Second"}},
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

