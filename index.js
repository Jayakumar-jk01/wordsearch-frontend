
let grid_size=10;
var words=[];

let parent_list=[];

const submitbutton=document.querySelector(".submit_word");
const add_btn=document.getElementsByClassName("add_word")[0];


add_btn.addEventListener("click",(event)=>{

  let input_word=document.getElementById("word");

  if(input_word.value!=''&&input_word.value!=" ")
  {
     const noSpaces = input_word.value.replace(/\s+/g, '');
    const h4Element = document.createElement('p');
    h4Element.textContent = noSpaces;
    const divElement = document.getElementById('words_section');
    divElement.appendChild(h4Element)

   



  
   
    
   
   


    words.push(noSpaces);
    console.log(parent_list)
    
  }



 

  input_word.value=''
  
  

})







var wordselect=false;

submitbutton.addEventListener("click",async()=>{

const apiUrl = 'https://q48pvy36v2.execute-api.ap-south-1.amazonaws.com/beta/wordsearchGame';
const data = {
   "grid_size":grid_size,
    "words":words
 };

const requestOptions = {
  method: 'POST',
  
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
};

fetch(apiUrl, requestOptions)
  .then(response => {
  return response.text();
  })
  .then(data => {
  generateGrid(grid_size,data);
  
   
  })
  
});



function generateGrid(grid_size,grid_words)
{
  delete_lastGrid();

  
  

   
  
  const onlyAlphabets = grid_words.replace(/[^a-zA-Z]/g, '');
  var idx=0;
  const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody");
  for (let i = 0; i < grid_size; i++) {

    const row = document.createElement("tr");

    for (let j = 0; j < grid_size; j++) {
      
      const cell = document.createElement("td");
      const cellText = document.createTextNode(` ${onlyAlphabets[idx++]}`);
      
      cell.setAttribute("x-data",`${i}`)
      cell.setAttribute("y-data",`${j}`);
      cell.appendChild(cellText);
      cell.style.padding = '10px';
      
      
      row.appendChild(cell);
    }

   

    

   tblBody.appendChild(row);
  
  }

  tbl.appendChild(tblBody);
  tbl.style.borderSpacing = '10px';

  
  const grid_section=document.getElementById("gridone");


  grid_section.append(tbl);
  
  tbl.setAttribute("border", "2");

 var temp=[]
 var result=[]

 var final_result=[]



  grid_section.addEventListener("mousedown",(event)=>{
   
   wordselect=true;
   

   
  })

  grid_section.addEventListener("mousemove",(event)=>{
   if(wordselect==true)
   {

    let targetElement = event.target;

    
    if (targetElement.tagName.toLowerCase() === 'td') {
      let x_d=false;
      let y_d=false;



      //finding the direction
      if(temp.length>=2)
      {
        if(temp[0].attributes[0].value!=temp[1].attributes[0].value)x_d=true;

        if(temp[0].attributes[1].value!=temp[1].attributes[1].value)y_d=true;

        console.log(x_d +" "+y_d)


      }

      if(temp.length==1)
      {
        let v=temp[temp.length-1];
        
        if((v.attributes[0].value!=targetElement.attributes[0].value)||(v.attributes[1].value!=targetElement.attributes[1].value))
        {
          temp.push(targetElement);
          result.push(targetElement.textContent);
          targetElement.style.backgroundColor = 'yellow'; 

        }
      }
      else if(temp.length>=2)
      {
        let v=temp[temp.length-1];
        if((v.attributes[0].value!=targetElement.attributes[0].value)&&(v.attributes[1].value!=targetElement.attributes[1].value))
        {
          if(x_d&&y_d)
          {
          temp.push(targetElement);
          result.push(targetElement.textContent);
          targetElement.style.backgroundColor = 'yellow'; 
          }
         

        }

        else if(v.attributes[0].value!=targetElement.attributes[0].value)
        {
          if(x_d)
          {
            temp.push(targetElement);
          result.push(targetElement.textContent);
          targetElement.style.backgroundColor = 'yellow'; 

          }
        }
        else if(v.attributes[1].value!=targetElement.attributes[1].value)
        {
          if(y_d)
          {
             temp.push(targetElement);
          result.push(targetElement.textContent);
          targetElement.style.backgroundColor = 'yellow'; 

          }
        }


      }
      else{
        temp.push(targetElement);
        result.push(targetElement.textContent);
        targetElement.style.backgroundColor = 'yellow'; 
      }
      
      
      // console.log(result)
    }
   
   }
  })

  grid_section.addEventListener("mouseup",(event)=>{
    wordselect=false;

    final_result.push(result.join('').replace(/\s+/g, ''));

   
   
    temp=[]
    result=[]

    console.log(final_result)
   
  })



var wordElement=document.getElementById('words_section');

wordElement.addEventListener("click",(event)=>{
  let str=event.target.textContent;

  let first_character=str[0];

 

  


  
  for(let i=0;i<10;i++)
  {
    let x=tbl.rows[i];
    let flag=0;
    for(let j=0;j<10;j++)
    {
    
      
          
          let y=x.cells[j];
          let r=y.textContent.trim();
          
          if(r===first_character)
          {
           if(solve_matrix_vertical(tbl,str,i,j))
           {
            console.log("done");
            flag=1;
            break;

           }
           else if(solve_matrix_horizontal(tbl,str,i,j))
           {
            console.log("hor")
            flag=1;
            break;

           }
           else if(solve_matrix_diagonal(tbl,str,i,j))
           {
            flag=1;
            break;

           }
          }
      
    }
    if(flag==1)
    {
      break;
    }
  }

  

 
 
})
 
}


function delete_lastGrid()
{
  var children=document.getElementById("gridone");
  if(children.childElementCount>1){
     var del_element=children.lastChild;

     del_element.remove();
  }
}


function solve_matrix_vertical(tbl,str,idx_x,idx_y)
{
 
 
 let count=0;
 let g=0;
  for(let i=idx_x;i<=9;i++)
  {
     let x=tbl.rows[i];
     let y=x.cells[idx_y];
    if(str[g++]===y.textContent.trim())
    {
      count++;
    }
    if(count==str.length)
  {
    for(let i=0;i<str.length;i++)
    {
      let x=tbl.rows[idx_x+i];
      let y=x.cells[idx_y];
      y.style.backgroundColor="red"

    }

    return true;
  }

  }

  

  return false;
  
}



function solve_matrix_horizontal(tbl,str,idx_x,idx_y)
{
 
 
 let count=0;
 let g=0;
  for(let i=idx_y;i<=9;i++)
  {
     let x=tbl.rows[idx_x];
     let y=x.cells[i];
    if(str[g++]===y.textContent.trim())
    {
      count++;
    }
    if(count==str.length)
  {
    for(let i=0;i<str.length;i++)
    {
      let x=tbl.rows[idx_x];
      let y=x.cells[idx_y+i];
      y.style.backgroundColor="red"

    }

    return true;
  }

  }

  

  return false;
  
}

function solve_matrix_diagonal(tbl,str,idx_x,idx_y)
{
 
 
 let count=0;
 let g=0;
  for(let i=idx_x,j=idx_y;i<=9&&j<=9;i++,j++)
  {
     let x=tbl.rows[i];
     let y=x.cells[j];
    if(str[g++]===y.textContent.trim())
    {
      count++;
    }
    if(count==str.length)
  {
    for(let i=0;i<str.length;i++)
    {
      let x=tbl.rows[idx_x];
      let y=x.cells[idx_y+i];
      y.style.backgroundColor="red"

    }

    return true;
  }

  }

  

  return false;
  
}