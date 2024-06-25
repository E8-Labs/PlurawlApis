const CheckinMoods = {
    MoodLep: "Low energy, Pleasant",
    MoodHep: "High energy, Pleasant",
    MoodLeup: "Low energy, Unpleasant",
    MoodHeup: "High energy, Unpleasant",
}


let HepGifs = ["https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnFrM2ozYjRyZXpmaXY4YWxzZTRhaGw3c3dqcnExNGo0M2Nsc3h4ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Tlh024W1MbjOUGYl6R/giphy.gif",
"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW05Mjg1bjZydmJlYzd2cmxtaHBveTA3eTU0YnY3Zmtwc3RkbWJjZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jTSOClK7HBoMaVn5Hi/giphy.gif",
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmVwZW4zaWxoYW92dGd3bzJjbHNmeHlzajc2Z2RjcGFibXF3aWx5byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DrA7TntG59xIB5FUld/giphy.gif",
"https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHZvYXpxNGliMjcwMGtpa3V3dmt5aWY4enNjeXVzNGh0MjNoMTh2dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KB7Moe2Oj0BXeDjvDp/giphy.gif", 
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHJ4cDcybHVsMDBzaDY5d2lvZ3dobTVna3Z0NnBzdTV0NXF3ajQ3cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ij5i490oEgU7ReCrLU/giphy.gif", 
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExenhjd2NtbGNxbGIxeGNpNnoxcmp3dDA4Y2FreWE4NzhoMnQ4bWg1cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UO5elnTqo4vSg/giphy.gif",
"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWxjbzdiOXhvb25xa2Z6ajNubWVoc3hpZjducXo2b2phMXl1b3N3MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oF5oUYTOhvFnO/giphy.gif",
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHJkbzNjMGI1cTdpeGRuMHhjMjAzcWMxOHpkcmluaWJlZm83Ync5aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Fo1cy8mqGDvbjpJBB7/giphy.gif", 
"https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDcwNzA5b2JjOXZjOHEzaWJzNnBva2Vycnh5Mmw5dmM5bmxrcHk0NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7eAvzJ0SBBzHy/giphy.gif",
"https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGVkdmdsYWxuYzJtNnh0dnVsbjRpMXV1Yzg0c2o2ZXgyODJva3R6ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ac269Ip2wr2stOEruj/giphy.gif"]

let HeupGifs = ["https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGV2ZDZiYjhvdHFlcGxmeDcyYW04cDdxb3J2NzlpMmYzZzZnczV4MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8y0bx23FDPCNoEU/giphy.gif",
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXl1ZTN4cmNuNWhwNnF2OGl1a3I0a2d3enFiYTB2ang1MDFicW43diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13Cmju3maIjStW/giphy.gif",
"https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWczOTYwanlhemtxaHVlN3hxcGozM29kc3dwdnFvbGJxNDcyc2RuYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/G4Ihli2UThrBS/giphy.gif",
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWM5eHk3ZThzbHBvcXFsandrdm1lNGY1anZ6bzVsM240dzhvZ21vcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NERY7uUYtur4Y/giphy.gif",
"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWg0Mm4xaTByYXEzdTc3ZDg2dXUxYjBnd25zNndvbWE1M3k3NXcxeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bEVKYB487Lqxy/giphy.gif",
"https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGdkMG5zZ2g2dHp0cWVwNmg5eTdxOW4xYzl2ZmFuMmEzdm1oamVzbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wPE3PC7Qoo2wnDon5E/giphy.gif",
"https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzJjaGFoMWw1aW8yaWtoNWVnMzZzZXlxaXFldGlqZ2JibDUyaW9mdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VeC3OqesxKDaire7Rb/giphy.gif",
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMG1uOHB5emE4cWhvN2ZvdXJoZWNnOTlwYmhxdXFnamRmb3JicXZveCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oxRmfJWm7w6LHx2b6/giphy.gif",
"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExajIxa2N5YnoxdjhocWNtZHlram1odThxd28yYzFpejYzanZkcGhuOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OK27wINdQS5YQ/giphy.gif",
"https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGN2YW45ZnM4MWRlbHFzcnptaHl5cGtkOXZ0bGNsN3h5M2V1aWpjZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Y10jDVwh8i75ZjCQu7/giphy.gif",

]

let LepGifs = ["https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3V0MXpkNjNwYW95Yzc5Zm9oc3EyYXNmdjg0YXpqZGpremQ2ZzNmOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0IsIpP1213JmNA88/giphy.gif",
"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGhvZWxvbG9tNDAwaWpzMGljYXdqcDdnZzlkZmRxcm96c3RnZXk0eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6vY59s91hWsxASYM/giphy.gif",
"https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDJsNm55bWN2cmhuaTB1MHp2bWVqaXJwaWNndXBseW0wbG90MnB1bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26hisjy85ML01lqH6/giphy.gif",
"https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjl5cWQ1cnc0NHF5Zm4xcW9ra2c5eTBtNGM1anI3eHF6Y2s2bjVnZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UtVVq0b2my7Yu7XyiM/giphy.gif",
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXYxMGc1cXo1ZTluOWU4MnJnNjRscGxkdDF0ZjlnMGh2ZnNrdTdidyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2ZYP7caQ9hZaguTqio/giphy.gif",
"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExenZ6bzE5MTZzdmVsNXp1cDh1d3YweW9qeW9ldzBrbjFpbXM4N3ZqOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mD44rhKpZP2SxTfwKm/giphy.gif",
"https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHdoZWd2aG5tdjV5Z3JnOWFsNG1qczJiOXAydzVxeGc4NTNoa3luaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4Zki4FNMTtJCn85jLQ/giphy.gif",
"https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2hqN2c1Mms3aHMwNjBjYTAzamUxb2ZjOTQ2ZDh4OHE1aWt4ZHc3NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/t8GdMbyjzwHvkzdraw/giphy.gif",
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdG5jcG9nbWU0OHFyd2IxY2Nna2ZsbzZvYzNicm4zZzJneWRjZXg0bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8OJdqYqN1Nii3UTD6l/giphy.gif",
"https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGVobW5qenA1cG80NGZqdHZwZG52cWdsODI2ZWx0NTFsMmZuMWlwaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QLvRBqfLXCphu/giphy.gif"
]
let LeupGifs = ["https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnM2bWVtdnFzY3dhd3VuZ281aGh6dTRsZ3Ixand1bjhkandpOHY5MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lqqgO1obaMaWWnIjan/giphy.gif",
"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGIwMXNwOXI1ZGNrdGYxY3NxajhhOWs1MGF3dGJ6eGYzbnRkdWxlcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gfsQffBnuc6e096brx/giphy.gif",
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXd4MGt5eGtrdGc3dWp3djFtNTkwdTlxeG5yb2tzbGR2YTFndjl5NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/J5CbtHodBHlIRuRzBo/giphy.gif",
"https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWUxOHV5Z29obWtqb2VreW5hcDVoMjl2dGJmd2ZwbzdtZGlrbDE3NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l1KVaj5UcbHwrBMqI/giphy.gif",
"https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHFwZDJ2dDlxdXg1YWFiYXE2MnM5ejV0OXJqcjd3eHg0b28wZXp6bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEduNEbTtAHABX0dy/giphy.gif",
"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW11N2QwcTYxaWNlaTE5ajR1MXcycDYwdDRucjJsMW40cm5kNzE0ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4rjcEJpI6qfsI/giphy.gif",
"https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExenMzcjFqdzdzeGFqMXpwYTBoaDUwOXJmbno3ZmM5eDNoaGs1aGFibSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yAKFw8AVTGX8A/giphy.gif",
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3pudGplY2U3dm5rcDR6aDlnMGNncmJqdWtmemw3Z2d2Z3VocWR4ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AzgoVxAQvgm52/giphy.gif",
"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3N3aHNid3M2NWhyNXIxdGw4dGpxcThlYWFpcmxydDQ1Z2t2a2ZlZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5ZCH1ZhZAEgqT2uC0f/giphy.gif",
"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExemYwY2tuNXI4cGZ6YXZnaHJ1cGc4Zm1vZTF0Z3drZHpsczAydjFidCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UE3RSEiWHgDgH8bSkI/giphy.gif"

]

function GenerateRandomGif(mood){
  const min = 0;
      const max = 9;
      const randomNumber =
          Math.floor(Math.random() * (max - min + 1)) + min;
          ////console.log("Random gif ", mood)
          if(mood.toLowerCase() === CheckinMoods.MoodHep.toLowerCase()){
              ////console.log(HepGifs[randomNumber])
              return HepGifs[randomNumber]
          }
          else if(mood.toLowerCase() === CheckinMoods.MoodHeup.toLowerCase()){
              ////console.log(HeupGifs[randomNumber])
              return HeupGifs[randomNumber]
          }
          else if(mood.toLowerCase() === CheckinMoods.MoodLep.toLowerCase()){
              ////console.log(LepGifs[randomNumber])
              return LepGifs[randomNumber]
          }
          else if(mood.toLowerCase() === CheckinMoods.MoodLeup.toLowerCase()){
              ////console.log(LeupGifs[randomNumber])
              return LeupGifs[randomNumber]
          }
}

export { CheckinMoods, GenerateRandomGif}
// export default CheckinMoods