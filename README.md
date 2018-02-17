# neotracker
an application that tracks and monitors guild activity. check out the live site [here](https://neotracker.herokuapp.com/)!
- guest credentials
  * username: guest
  * password: password

## porpoise 🐬
Maintaining a guild in [Neopets](http://www.neopets.com) is a legit job. You have to be quick to address faltering member activity and see what events work and what events don't.

After running MuxHo, an anime/manga guild, for three years, I've decided to create an application that visualizes and monitors member activity. It tracks how many members posted, and who are posting.

This will give me and other council members a better idea of how the guild is performing and when and allow us to make connections how the guild activity corresponds to how much effort we are putting in.

## uml component diagram 📈
![uml component diagram](assets/img/mockup/diagram.png)

## er diagram
![ER diagram](assets/img/mockup/ER%20diagram.png)

## challenges
1. Parsing through Neopets was hard.
2. Figuring out how to display the data on the graph AND the neomail was difficult.
3. Setting up the database was also difficult.

## mockup 🎨
<img src="https://i.gyazo.com/8fc86fc3e215def465ef7d710e494f92.png" width="165px"> <img src="https://i.gyazo.com/5b12eafb723fc245f032e9c091ae2aa8.png" width="165px"> <img src="assets/img/mockup/neomailpage.png" width="165px"> <img src="assets/img/mockup/createneomailpage.png" width="165px"> <img src="assets/img/mockup/neomailcontentpage.png" width="165px">

## to do
- [ ] fix `monitor.js` so that it accounts for when there is a poll, which means we have to look at the 15th table, not 14th)
- [ ] fix the neomail layout
- [ ] allow admins mark members inactive/active in the application
