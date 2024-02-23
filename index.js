const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

let products=[];
//get data from flipkart
const getDataFromFlipkart = async () => {
  try {
    const response = await axios.get(
      "https://www.flipkart.com/search?q=mobile+5g&sid=tyy%2C4io&as=on&as-show=on&otracker=AS_QueryStore_OrganicAutoSuggest_1_6_na_na_ps&otracker1=AS_QueryStore_OrganicAutoSuggest_1_6_na_na_ps&as-pos=1&as-type=RECENT&suggestionId=mobile+5g%7CMobiles&requestId=b4b532c1-2ea0-408f-ae68-53db614bb7b3&as-searchtext=mobile%205g",
      {
        // for getting the data in the form of html
        headers:{
            'Content-Type':"text/html"
        }
      }
    );
    const data = response.data;
    const $ = cheerio.load(data);
    const productContainer=$('._1AtVbE.col-12-12');
    $(productContainer).each((i,e)=>{
        // for getting the title of the webpage
        let title=$(e).find('._4rR01T').text();
        let price=$(e).find("._30jeq3._1_WHN1").text();
        let rating=$(e).find("._3LWZlK").text();
        products.push({ title, price,rating});
    });
    console.log(products);
    //make the workbook 
    const workbook=xlsx.utils.book_new();
    // add the data in the workbook 
    const sheetData = [
        ["Title", "Price","Rating"],
        ...products.map((product) => [product.title, product.price,product.rating]),
      ];

      const workSheet = xlsx.utils.aoa_to_sheet(sheetData);
      // append the data in the workbook 
      xlsx.utils.book_append_sheet(workbook, workSheet, 'Sheet1');
      xlsx.writeFile(workbook, 'output.xlsx');

  } catch (err) {
    console.log(err);
  }
};
getDataFromFlipkart();