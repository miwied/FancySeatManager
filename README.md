#  FancySeatManager

Imagine a restaurant with a big round table surrounded by ***n*** seats. The **FancySeatManager** is an algorithm that determines if there are enough contiguous seats for a group of ***x*** people and always selects the most efficient seat for them so that the restaurant owner can accommodate as many guests as possible.</br>

<img src="doc/images/FancySeatManager - explanation image.png" alt="FancySeatManager - explanation image"/>

## implementation 
I implemented this algorithm in [C#](https://github.com/miwied/FancySeatManager/blob/master/FancySeatManager%20-%20C%23/Program.cs) as a console application and aswell in [JavaScript](https://github.com/miwied/FancySeatManager/blob/master/FancySeatManager%20-%20JavaScript/FancySeatManager.js) with a neat visualization of the seats and groups.</br>
It was a nice programming exercise and an interesting comparison of these two programming languages and the usage of the different implementation options.

##  features

- setting a number of n seats
- adding a group of x people
- auto generated incremental group-id
- remove a group with the corresponding group-id
- notification when group is set or no more space is available

## javascript web application pictures

<table>
  <tr>
    <td>main view</td>
     <td>create 20 seats</td>
  </tr>
  <tr>
    <td><img src="doc/images/web application/default screen.png"></td>
    <td><img src="doc/images/web application/setting the number of seats.png"></td>
  </tr>
  <tr>
    <td></br></td>
    <td></br></td>
  </tr>
  <tr>
    <td>adding a group of 3 people</td>
    <td>not enough space anymore</td>
  </tr>
  <tr>
    <td><img src="doc/images/web application/adding a group with 3 people.png"></td>
    <td><img src="doc/images/web application/not enough space for a group of 5.png"></td>
  </tr>
  <tr>
    <td>remove group with the id 2</td>
  </tr>
  <tr>
    <td><img src="doc/images/web application/remove the group with the id 2.png"></td>
  </tr>
 </table>
 
 ## c# console application pictures
 
 <table>
  <tr>
    <td>create 10 seats</td>
    <td>adding a group of 3 people</td>
  </tr>
  <tr>
    <td><img src="doc/images/console application/setting the number of seats.png"></td>
    <td><img src="doc/images/console application/adding a group with 3 people.png"></td>
  </tr>
  <tr>
    <td></br></td>
    <td></br></td>
  </tr>
  <tr>
    <td>remove group with the id 2</td>
  </tr>
  <tr>
    <td><img src="doc/images/console application/remove the group with the id 2.png"></td>
  </tr>
 </table>
