import { Button } from "react-bootstrap";
import { TrendingActivity } from "./Chartdata";
import { Link } from "react-router-dom";
import ALLImages from "./Imagedata";

export const TRADINGACTIVITIES = [
  {
    id: 1,
    icon: 'btc',
    name: 'Bitcoin ',
    title: 'BTC',
    price: 'USD 680,175.06',
    change: '+13%',
    changeStatus: 'success',
    date: <TrendingActivity />,
    status: 'success',
    statusText: 'DELIVERY'
  },
  {
    id: 2,
    icon: 'eth',
    name: 'Ethereum ',
    title: 'ETH',
    price: 'USD 345,235.02',
    change: '-13%',
    changeStatus: 'danger',
    date: <TrendingActivity />,
    status: 'danger',
    statusText: 'CANCEL'
  },
  {
    id: 3,
    icon: 'xrp',
    name: 'Ripple ',
    title: 'XRP',
    price: 'USD 235,356.12',
    change: '-2.23%',
    changeStatus: 'warning',
    date: <TrendingActivity />,
    status: 'warning',
    statusText: 'HOLD'
  },
  {
    id: 4,
    icon: 'ltc',
    name: 'Litecoin',
    title: 'LTC',
    price: 'USD 456,235.52',
    change: '-1.13%',
    changeStatus: 'danger',
    date: <TrendingActivity />,
    status: 'danger',
    statusText: 'CANCEL'
  }
];

export const BuyingsellingOrders =
  [
    { ID: "#123450", Type: "Buy", typeinfo: "success", Order: "success", Amount: 0.37218, Remaining: 0.42173, Price: "25681.13", Usd: "$5273.15", Fee: "0.1", Status: "success", statustext: "Completed", Date: "10-05-2019  02:12:34", },
    { ID: "#123451", Type: "Sell", typeinfo: "danger", Order: "danger", Amount: 1.47364, Remaining: 0.36472, Price: "73647.15", Usd: "$2637.37", Fee: "0.1", Status: "warning", statustext: "Pending", Date: "10-05-2019 07:14:32", },
    { ID: "#123452", Type: "Sell", typeinfo: "danger", Order: "danger", Amount: 0.63736, Remaining: 0.73748, Price: "72637.15", Usd: "$6342.16", Fee: "0.1", Status: "danger", statustext: "Cancelled", Date: "05-05-2019 12:57:12", },
    { ID: "#123453", Type: "Buy", typeinfo: "success", Order: "success", Amount: 0.83643, Remaining: 0.83643, Price: "83748.15", Usd: "$23836.09", Fee: "0.1", Status: "success", statustext: "Completed", Date: "15-07-2019 10:43:17", },
    { ID: "#123454", Type: "Buy", typeinfo: "success", Order: "success", Amount: 0.767263, Remaining: 0.72563, Price: "326535.32", Usd: "$7235.25", Fee: "0.1", Status: "success", statustext: "Completed", Date: "22-07-2019 11:44:45", },
    { ID: "#123455", Type: "Sell", typeinfo: "danger", Order: "danger", Amount: 0.46263, Remaining: 0.27363, Price: "28937.15", Usd: "$4853.15", Fee: "0.1", Status: "primary", statustext: "In Process", Date: "30-07-2019  08:23:15", },
  ];

export const walletinfo = [
  { id: 1, Wallet: "ETHEREUM Wallet", Walletaddress: "Wallet Address", Currencies: ALLImages('svg1'), ETHINFO: "Available ETH", VAlueofETH: 0.257134, Ethshortcut: "ETH", EthQRcode: ALLImages('png22'), bitcoin: "btc", EthoReceived: "Received ETH", Ethohigh: "left", EthoReceivedmoney: "+ 1,50,500", EthCurrencies: "ETH", EthoSent: "Send ETH", Ethorlow: "right", EthoSentmoney: "- 25,500", EthoDeposit: "Deposit", EthoWithdraw: "Withdraw", dValue: 'ac34290d04cc54f02d22' },
  { id: 2, Wallet: "Ripple  Wallet", Walletaddress: "Wallet Address", Currencies: ALLImages('svg2'), ETHINFO: "Available XRP", VAlueofETH: 0.243457, Ethshortcut: "XRP", EthQRcode: ALLImages('png22'), bitcoin: "xrp", EthoReceived: "Received XRP", Ethohigh: "left", EthoReceivedmoney: "+ 1,25,500", EthCurrencies: "XRP", EthoSent: "Sent XRP", Ethorlow: "right", EthoSentmoney: "- 59000", EthoDeposit: "Deposit", EthoWithdraw: "Withdraw", dValue: '1EeWrxcDDjyhWwcKu' },
  { id: 3, Wallet: "Dash  Wallet", Walletaddress: "Wallet Address", Currencies: ALLImages('svg5'), ETHINFO: "Available DASH", VAlueofETH: 0.0224, Ethshortcut: "DASH", EthQRcode: ALLImages('png22'), bitcoin: "dash", EthoReceived: "Received DASH", Ethohigh: "left", EthoReceivedmoney: "+ 1,50,500", EthCurrencies: "DASH", EthoSent: "Send DASH", Ethorlow: "right", EthoSentmoney: "- 25,500", EthoDeposit: "Deposit", EthoWithdraw: "Withdraw", dValue: '1N4LsCG8ko4aia4vJYR' },
  { id: 4, Wallet: "Litecoin  Wallet", Walletaddress: "Wallet Address", Currencies: ALLImages('svg4'), ETHINFO: "Available LTC", VAlueofETH: 0.25713, Ethshortcut: "LTC", EthQRcode: ALLImages('png22'), bitcoin: "ltc", EthoReceived: "Received LTC", Ethohigh: "left", EthoReceivedmoney: "+ 1,50,500", EthCurrencies: "LTC", EthoSent: "Send LTC", Ethorlow: "right", EthoSentmoney: "- 25,500", EthoDeposit: "Deposit", EthoWithdraw: "Withdraw", dValue: '1LgejHMvhRoWxRqNM' },
];

export const ProductsDetails =
  [
    { Productid: "#C234", Productname: ALLImages('png14'), Producttext: "Regular Backpack", Productcost: "$14,500", Total: "2,977", Status: "Available", Statustext: "primary", class: ''},
    { Productid: "#C389", Productname: ALLImages('png15'), Producttext: "Women Pink Sandal", Productcost: "$30,000", Total: "678	", Status: "Limited", Statustext: "primary", class: ''},
    { Productid: "#C936", Productname: ALLImages('png16'), Producttext: "Designer Flower Pot", Productcost: "$13,200", Total: "4,922	", Status: "Available", Statustext: "primary", class: ''},
    { Productid: "#C493", Productname: ALLImages('png17'), Producttext: "Plastic Outdoor Chair", Productcost: "$14,500", Total: "1,234", Status: "Limited", Statustext: "primary", class: '' },
    { Productid: "#C729", Productname: ALLImages('png18'), Producttext: "Digital Smart Watch", Productcost: "$5,987", Total: "4,789", Status: "NoStock", Statustext: "primary  op-5", class: '' },
    { Productid: "#C529", Productname: ALLImages('png19'), Producttext: "Apple iPhone", Productcost: "$11,987", Total: "938", Status: "Limited", Statustext: "primary", class: 'border-bottom-0'},
  ];

export const Productdetails =
  [
    { ProductId: "Women's Red Dress", Product1: ALLImages('png1'), Product2: ALLImages('png2'), Productpriceold: "$19.00", Productdiscountnew: "$20.00", Addtocart: "Add to cart ", Quickview: "Quick View", ProductRating: "icons", Productdiscount: "- 33%", Productdiscounttext: "success", discountoffer: "discount", Favorite: "heart", },
    { ProductId: "Casual Wear Top", Product1: ALLImages('png3'), Product2: ALLImages('png4'), Productpriceold: "$17.00", Productdiscountnew: "$20.00", Addtocart: "Add to cart ", Quickview: "Quick View", ProductRating: "icons", Favorite: "heart", },
    { ProductId: "Party Wear Black Top", Product1: ALLImages('png7'), Product2: ALLImages('png8'), Productpriceold: "$24.00", Productdiscountnew: "$20.00", discountoffer: "discount", Productdiscount: "- 50%", Productdiscounttext: "info", Addtocart: "Add to cart ", Quickview: "Quick View", ProductRating: "icons", Favorite: "heart", },
    { ProductId: "Women's Rayon Top", Product1: ALLImages('png9'), Product2: ALLImages('png10'), Productpriceold: "$15.00", Productdiscountnew: "$20.00", Addtocart: "Add to cart ", Quickview: "Quick View", ProductRating: "icons", Favorite: "heart", },
    { ProductId: "Western Skirt & Top", Product1: ALLImages('png11'), Product2: ALLImages('png12'), Productpriceold: "$18.00", Productdiscountnew: "$20.00", discountoffer: "discount", Productdiscount: "- 40%", Productdiscounttext: "danger", Addtocart: "Add to cart ", Quickview: "Quick View", ProductRating: "icons", Favorite: "heart", },
    { ProductId: "Party Wear Fancy Top", Product1: ALLImages('png2'), Product2: ALLImages('png1'), Productpriceold: "$19.00", Productdiscountnew: "$20.00", Addtocart: "Add to cart ", Quickview: "Quick View", ProductRating: "icons", Favorite: "heart", },
    { ProductId: "Long Floral Tunic Tops", Product1: ALLImages('png5'), Product2: ALLImages('png6'), Productpriceold: "$33.00", Productdiscountnew: "$20.00", discountoffer: "discount", Productdiscount: "- 43%", Productdiscounttext: "warning", Addtocart: "Add to cart ", Quickview: "Quick View", ProductRating: "icons", Favorite: "heart", },
    { ProductId: "Long Slit Full Sleeve", Product1: ALLImages('png13'), Product2: ALLImages('png31'), Productpriceold: "$46.00", Productdiscountnew: "$20.00", Addtocart: "Add to cart ", Quickview: "Quick View", ProductRating: "icons", Favorite: "heart", },
    { ProductId: "Long Floral Tunic Tops", Product1: ALLImages('png33'), Product2: ALLImages('png32'), Productpriceold: "$25.00", Productdiscountnew: "$20.00", Addtocart: "Add to cart ", Quickview: "Quick View", ProductRating: "icons", Favorite: "heart", }
  ];

export const Shoppingcart = [
  { id: 1, Product: ALLImages('png14'), ProductName: "COLLEGE BAG", Color: "Color:", Colorpicker: "Black color", Qty: "Out of stock", Qtytext: "danger", Quantity: 1, Price: 26, dValue: 2 },
  { id: 2, Product: ALLImages('png15'), ProductName: "PARTY WEAR SHOES", Color: "Color:", Colorpicker: "Pink", Qty: "In stock", Qtytext: "success", Quantity: 2, Price: 23, dValue: 1 },
  { id: 3, Product: ALLImages('png19'), ProductName: "SAMSUNG A2", Color: "Color:", Colorpicker: "Black color", Qty: "Out of stock", Qtytext: "danger", Quantity: 3, Price: 56, dValue: 1 },
  { id: 4, Product: ALLImages('png16'), ProductName: "FLOWER POT", Color: "Color:", Colorpicker: " Green and Black color", Qty: "In stock", Qtytext: "success", Quantity: 4, Price: 36, dValue: 2 },
  { id: 5, Product: ALLImages('png17'), ProductName: "CHAIR", Color: "Color:", Colorpicker: "Green and Black color", Qty: "In stock", Qtytext: "success", Quantity: 6, Price: 24, dValue: 3 },
  { id: 6, Product: ALLImages('png18'), ProductName: "WATCH", Color: "Color:", Colorpicker: "Green and Black color", Qty: "Out of stock", Qtytext: "danger", Quantity: 7, Price: 34, dValue: 1 },
];

export const WishlistData = [
  {
    id: 1,
    ProductId: "Men's Shoes",
    Product1: ALLImages('ecommerce15'),
    Productpriceold: "$49.00",
    Productdiscountnew: "$39.00",
    Addtocart: "Add to cart ",
    ratingvalue: "(25)",
  },
  {
    id: 2,
    ProductId: "Hand Bag",
    Product1: ALLImages('ecommerce12'),
    Productpriceold: "$30.00",
    Productdiscountnew: "$21.00",
    Addtocart: "Add to cart ",
    ratingvalue: "(14)",
  },
  {
    id: 3,
    ProductId: "Wrist Watch",
    Product1: ALLImages('ecommerce14'),
    Productpriceold: "$29.00",
    Productdiscountnew: "$15.00",
    Addtocart: "Add to cart ",
    ratingvalue: "(22)",
  },
  {
    id: 4,

    ProductId: "Long Frock",
    Product1: ALLImages('png4'),
    Productpriceold: "$32.00",
    Productdiscountnew: "$22.00",
    Addtocart: "Add to cart ",
    ratingvalue: "(22)",
  },
  {
    id: 5,

    ProductId: "Girls Sandals",
    Product1: ALLImages('ecommerce7'),
    Productpriceold: "$30.00",
    Productdiscountnew: "$21.00",
    Addtocart: "Add to cart ",
    ratingvalue: "(14)",
  },

  {
    id: 6,
    ProductId: "Sofa Chair",
    Product1: ALLImages('ecommerce11'),
    Productpriceold: "$29.00",
    Productdiscountnew: "$15.00",
    Addtocart: "Add to cart ",
    ratingvalue: "(22)",
  },
  {
    id: 7,

    ProductId: "Laptop",
    Product1: ALLImages('ecommerce8'),
    Productpriceold: "$200.00",
    Productdiscountnew: "$149.00",
    Addtocart: "Add to cart ",
    ratingvalue: "(19)",
  },
  {
    id: 8,
    ProductId: "Soft Toy",
    Product1: ALLImages('ecommerce13'),
    Productpriceold: "$49.00",
    Productdiscountnew: "$39.00",
    Addtocart: "Add to cart ",
    ratingvalue: "(25)",
  },
];

export const TableData = [
  { id: 1, orderid: "#W83549801", invoice: 2, name: "Anna Sthesia", date: "08/11/2020", total: "$1000", warehouse: "Boston", status: "Pending", color: 'warning' },
  { id: 2, orderid: "#W83549802", invoice: 5, name: "Barb Dwyer", date: "15/11/2020", total: "$4577", warehouse: "Washington DC", status: "Delivered", color: 'success' },
  { id: 3, orderid: "#W83549803", invoice: 3, name: "Wilma Mumduya", date: "17/11/2020", total: "$4500", warehouse: "San Francisco", status: "Delivered", color: 'success' },
  { id: 4, orderid: "#W83549804", invoice: 4, name: "Zack Lee", date: "18/11/2020", total: "$3266", warehouse: "Las Vegas", status: "Refunded", color: 'info' },
  { id: 5, orderid: "#W83549805", invoice: 5, name: "Tom Foolery", date: "20/11/2020", total: "$1,30,000", warehouse: "Los Angeles", status: "Cancelled", color: 'danger' },
  { id: 6, orderid: "#W83549806", invoice: 6, name: "Pat Agonia", date: "22/11/2020", total: "$2,535", warehouse: "Chicago", status: "Delivered", color: 'success' },
  { id: 7, orderid: "#W83549807", invoice: 6, name: "Mary Christmas", date: "26/11/2020", total: "$1,526", warehouse: "Los Angeles", status: "Cancelled", color: 'danger' },
  { id: 8, orderid: "#W83549808", invoice: 5, name: "Ella Vator", date: "29/11/2020", total: "$1,500", warehouse: "Chicago", status: "Pending", color: 'warning' },
  { id: 9, orderid: "#W83549809", invoice: 8, name: "Sharon Needles", date: "01/12/2020", total: "$2,30,000", warehouse: "Uk", status: "Delivered", color: 'success' },
  { id: 10, orderid: "#W83549810", invoice: 7, name: "Anne Fibbiyon", date: "04/12/2020", total: "$33,990", warehouse: "Chicago", status: "Refunded", color: 'info' },
  { id: 11, orderid: "#W83549811", invoice: 9, name: "Frank Senbeans", date: "09/12/2020", total: "$12,999", warehouse: "Chicago", status: "Cancelled", color: 'danger' },
  { id: 12, orderid: "#W83549812", invoice: 12, name: "Chris P. Bacon", date: "12/12/2020", total: "$15,993", warehouse: "Brazil", status: "Delivered", color: 'success' },
]

export const TASKS = [
  {
    Task: "Evaluating the design",
    TeamMember1: ALLImages('face1'),
    TeamMember2: ALLImages('face2'),
    TeamMember3: ALLImages('face3'),
    TeamMember4: ALLImages('face4'),
    OpenTask: "37",
    TaskProfit: "High",
    Profittext: "primary",
    Status: "Completed",
    Statustext: "primary",
    checked: true
  },
  {
    Task: "Generate ideas for design",
    TeamMember1: ALLImages('face1'),
    TeamMember2: ALLImages('face10'),
    TeamMember3: ALLImages('face11'),
    TeamMember4: ALLImages('face12'),
    OpenTask: "37",
    TaskProfit: "Normal",
    Profittext: "secondary",
    Status: "pending",
    Statustext: "warning",
    checked: false
  },
  {
    Task: "Define the problem",
    TeamMember1: ALLImages('face3'),
    TeamMember2: ALLImages('face6'),
    TeamMember3: ALLImages('face7'),
    TeamMember4: ALLImages('face4'),
    OpenTask: "37",
    TaskProfit: "Low",
    Profittext: "warning",
    Status: "Completed",
    Statustext: "primary",
    checked: true
  },
  {
    Task: "Empathize with users",
    TeamMember1: ALLImages('face4'),
    TeamMember2: ALLImages('face5'),
    TeamMember3: ALLImages('face6'),
    TeamMember4: ALLImages('face3'),
    OpenTask: "37",
    TaskProfit: "high",
    Profittext: "primary",
    Status: "Rejected",
    Statustext: "danger",
    checked: false
  },
];

export const CryptMarketingValues =
  [
    { ID: 1, Symbol: "bitcoin", Name: "Bitcoin", crypt: "BTC", lastprice: "$151.00", MarkerCap: "$518", Change: "success", platform: "Trade", IMAGES: ALLImages('svg3'), },
    { ID: 2, ymbol: "ethereum", Name: "Ethereum", crypt: "ETH", lastprice: "$723.48", MarkerCap: "$448", Change: "success", platform: "Trade", IMAGES: ALLImages('svg1'), },
    { ID: 3, Symbol: "ripple", Name: "Ripple", crypt: "XRP", lastprice: "$425.25", MarkerCap: "$763", Change: "success", platform: "Trade", IMAGES: ALLImages('svg2'), },
    { ID: 4, Symbol: "litecoin", Name: "Litecoin", crypt: "LTC", lastprice: "$1.2029", MarkerCap: "$678,", Change: "danger", platform: "Trade", IMAGES: ALLImages('svg4'), },
    { ID: 5, Symbol: "neo", Name: "Neo", crypt: "NEO", lastprice: "$154.67", MarkerCap: "$197", Change: "danger", platform: "Trade", IMAGES: ALLImages('svg8'), },
    { ID: 6, Symbol: "monero", Name: "Monero", crypt: "XMR", lastprice: "$305.16", MarkerCap: "$4,778", Change: "success", platform: "Trade", IMAGES: ALLImages('svg7'), },
    { ID: 7, Symbol: "eos", Name: "Eos", crypt: "EOS", lastprice: "$149.18", MarkerCap: "$8,44", Change: "danger", platform: "Trade", IMAGES: ALLImages('svg10'), },
    { ID: 8, Symbol: "steem", Name: "Steem", crypt: "STEEM", lastprice: "$0.4673", MarkerCap: "$8,358", Change: "success", platform: "Trade", IMAGES: ALLImages('svg9'), },
    { ID: 9, Symbol: "lota", Name: "Lota", crypt: "LOTA", lastprice: "$2.34", MarkerCap: "$654", Change: "danger", platform: "Trade", IMAGES: ALLImages('svg6'), },
    { ID: 10, Symbol: "dash", Name: "Dash", crypt: "DASH", lastprice: "$747.2", MarkerCap: "$588", Change: "success", platform: "Trade", IMAGES: ALLImages('svg5'), },
    { ID: 11, Symbol: "waves", Name: "Bitcoin", crypt: "NEM", lastprice: "$181.39", MarkerCap: "$3,084", Change: "danger", platform: "Trade", IMAGES: ALLImages('svg11'), },
  ];

export const AllOrder = [
  {
    Id: "#34350",
    Catlog: ALLImages('png17'),
    Productcolor: "border",
    Product: "Plastic Outdoor Chair",
    Quatity: 1,
    Price: "$200",
    Total: "$200",
  },
  {
    Id: "#34351",
    Catlog: ALLImages('png18'),
    Productcolor: "border",
    Product: "Black Digital smart watch",
    Quatity: 2,
    Price: "$500",
    Total: "$500",
  },
  {
    Id: "#34352",
    Catlog: ALLImages('png15'),
    Productcolor: "border",
    Product: "Women Pink Heels Sandal",
    Quatity: 2,
    Price: "$400",
    Total: "$400",
  },
  {
    Id: "#34353",
    Catlog: ALLImages('png19'),
    Productcolor: "border",
    Product: "Apple iPhone(Black, 128 GB)",
    Quatity: 2,
    Price: "$800",
    Total: "$800",
  },
];

export const Visitors = [
  {
    VisitorsId: ALLImages('face3'),
    VisitorsName: "Socrates Itumay",
    Visitorsrole: "Web Developer",
    Visitorsfollow: "Follow",
    Visitorsfollowtext: "secondary",
    VisitorBtn: "btn",
  },
  {
    VisitorsId: ALLImages('face4'),
    VisitorsName: "Reynante Labares",
    Visitorsrole: "CEO",
    Visitorsfollow: "Follow",
    Visitorsfollowtext: "info",
    VisitorBtn: "btn",
  },
  {
    VisitorsId: ALLImages('face5'),
    VisitorsName: "Owen Bongcaras",
    Visitorsrole: "Manager",
    Visitorsfollow: "Follow",
    Visitorsfollowtext: "primary",
    VisitorBtn: "btn",
  },
  {
    VisitorsId: ALLImages('face6'),
    VisitorsName: "Mariane Galeon",
    Visitorsrole: "Administrator",
    Visitorsfollow: "Follow",
    Visitorsfollowtext: "success",
    VisitorBtn: "btn",
  },
  {
    VisitorsId: ALLImages('face7'),
    VisitorsName: "Administrator",
    Visitorsrole: "Founder",
    Visitorsfollow: "Follow",
    Visitorsfollowtext: "warning",
    VisitorBtn: "btn",
  },
  {
    VisitorsId: ALLImages('face3'),
    VisitorsName: "Wilson Rose",
    Visitorsrole: "Auditor",
    Visitorsfollow: "Follow",
    Visitorsfollowtext: "primary",
    VisitorBtn: "btn",
  },
  {
    VisitorsId: ALLImages('face2'),
    VisitorsName: "Sonia Fraser",
    Visitorsrole: "App Developer",
    Visitorsfollow: "Follow",
    Visitorsfollowtext: "primary",
    VisitorBtn: "btn",
  },
];
export const UserlistData = [
  {
    id: 1,
    Product1: ALLImages('face1'),
    ProductId: "Megan Peters",
    created: "08/06/2022",
    status: "Inactive",
    email: "mila@Kunis.com",
    information: "muted"

  },
  {
    id: 2,
    Product1: ALLImages('face2'),
    ProductId: "George Clooney",
    created: "08/06/2022",
    status: "active",
    email: "	marlon@brando.com",
    information: "success"
  },
  {
    id: 3,
    Product1: ALLImages('face3'),
    ProductId: "Ryan Gossling	",
    created: "08/06/2022",
    status: "Banned",
    email: "jack@nicholson",
    information: "danger"
  },
  {
    id: 4,
    Product1: ALLImages('face1'),
    ProductId: "Emma Watson",
    created: "16/06/2022",
    status: "Pending",
    email: "jack@nicholsonm",
    information: "warning"

  },
  {
    id: 5,
    Product1: ALLImages('face12'),
    ProductId: "Mila Kunis",
    created: "18/06/2022",
    status: "Inactive",
    information: "muted",
    email: "mila@Kunis.com",
  },

  {
    id: 6,
    Product1: ALLImages('face4'),
    ProductId: "	Phil Watsons",
    created: "22/06/2022",
    status: "active",
    email: "	phil@watson.com",
    information: "success",
  },
  {
    id: 7,
    Product1: ALLImages('face5'),
    ProductId: "Sonia Robertson",
    created: "25/06/2022",
    status: "active",
    email: "robertson@sonia.com",
    information: "success"
  },
  {
    id: 8,
    Product1: ALLImages('face7'),
    ProductId: "Megan Peters",
    created: "28/06/2022",
    status: "Banned",
    email: "amelia23@kunis.com",
    information: "danger"
  },
  {
    id: 9,
    Product1: ALLImages('face9'),
    ProductId: "Adam Hamilton",
    created: "30/06/2022",
    status: "pending",
    email: "	morganleah@.com",
    information: "warning"

  },
  {
    id: 10,
    Product1: ALLImages('face11'),
    ProductId: "Leah Morgan",
    created: "08/06/2022",
    status: "active",
    email: "mila@Kunis.com",
    information: "success"

  },
  {
    id: 11,
    Product1: ALLImages('face6'),
    ProductId: "Paul Molive",
    created: "12/07/2020",
    status: "active",
    email: "paul45@kunis.com",
    information: "success"
  }
];


export const AlertCard = [
  {
    id: 1,
    icon: (
      <svg
        className="custom-alert-icon svg-primary"
        xmlns="http://www.w3.org/2000/svg"
        height="1.5rem"
        viewBox="0 0 24 24"
        width="1.5rem"
        fill="#000000"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
    heading: 'Information?',
    color: 'primary',
    Element: (
      <div className="">
        <Button variant='outline-danger' size='sm' className="m-1">Decline</Button>
        <Button variant='primary' size='sm' className="m-1">Accept</Button>
      </div>
    ),
  },
  {
    id: 2,
    icon: (
      <svg
        className="custom-alert-icon svg-secondary"
        xmlns="http://www.w3.org/2000/svg"
        height="1.5rem"
        viewBox="0 0 24 24"
        width="1.5rem"
        fill="#000000"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    heading: 'Confirmed',
    color: 'secondary',
    Element: (
      <div className="">
        <Button variant='secondary' size='sm' className="m-1">Close</Button>
      </div>
    ),
  },
  {
    id: 3,
    icon: (
      <svg
        className="custom-alert-icon svg-warning"
        xmlns="http://www.w3.org/2000/svg"
        height="1.5rem"
        viewBox="0 0 24 24"
        width="1.5rem"
        fill="#000000"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    ),
    heading: 'Warning',
    color: 'warning',
    Element: (
      <div className="">
        <Button variant='outline-secondary' size='sm' className="m-1">Back</Button>
        <Button variant='warning' size='sm' className="m-1">Continue</Button>
      </div>
    ),
  },
  {
    id: 4,
    icon: (
      <svg
        className="custom-alert-icon svg-danger"
        xmlns="http://www.w3.org/2000/svg"
        height="1.5rem"
        viewBox="0 0 24 24"
        width="1.5rem"
        fill="#000000"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z" />
      </svg>
    ),
    heading: 'Danger',
    color: 'danger',
    Element: (
      <div className="">
        <Button variant='danger' size='sm' className="m-1">Delete</Button>
      </div>
    ),
  },
];


export const ColoredAlert = [
  { id: 1, icon: <svg className="flex-shrink-0 svg-primary" xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>, color: 'primary', heading: 'Information Alert', description: 'Information alert to show to information', class: 'secondary' },
  { id: 2, icon: <svg className="flex-shrink-0 svg-secondary" xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" /><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg>, color: 'secondary', heading: 'Success Alert', description: 'Success alert to show to success message', class: 'danger' },
  { id: 3, icon: <svg className="flex-shrink-0 svg-warning" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><g><g><path d="M12,5.99L19.53,19H4.47L12,5.99 M12,2L1,21h22L12,2L12,2z" /><polygon points="13,16 11,16 11,18 13,18" /><polygon points="13,10 11,10 11,15 13,15" /></g></g></g></svg>, color: 'warning', heading: 'Warning Alert', description: 'Warning alert to show warning message', class: 'dark' },
  { id: 4, icon: <svg className="flex-shrink-0 svg-danger" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><g><g><path d="M15.73,3H8.27L3,8.27v7.46L8.27,21h7.46L21,15.73V8.27L15.73,3z M19,14.9L14.9,19H9.1L5,14.9V9.1L9.1,5h5.8L19,9.1V14.9z" /><rect height="6" width="2" x="11" y="7" /><rect height="2" width="2" x="11" y="15" /></g></g></g></svg>, color: 'danger', heading: 'Danger Alert', description: 'Danger alert to show the danger message', class: 'info' },
]

export const SolidAlert = [
  {
    id: 1, icon: <svg className="flex-shrink-0 svg-white" xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>, color: 'primary', heading: 'Information Alert', description: 'Information alert to show to information', class: 'secondary', element: (<div className="fs-12">
      <Link to="#" className="text-fixed-white fw-semibold me-2 op-7">cancel</Link>
      <Link to="#" className="text-fixed-white fw-semibold">open</Link>
    </div>)
  },
  {
    id: 2, icon: <svg className="flex-shrink-0 svg-white" xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" /><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg>, color: 'secondary', heading: 'Success Alert', description: 'Success alert to show to success message', class: 'danger', element: (<div className="fs-12">
      <Link to="#" className="text-fixed-white fw-semibold me-2">close</Link>
    </div>)
  },
  {
    id: 3, icon: <svg className="flex-shrink-0 svg-white" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><g><g><path d="M12,5.99L19.53,19H4.47L12,5.99 M12,2L1,21h22L12,2L12,2z" /><polygon points="13,16 11,16 11,18 13,18" /><polygon points="13,10 11,10 11,15 13,15" /></g></g></g></svg>, color: 'warning', heading: 'Warning Alert', description: 'Warning alert to show warning message', class: 'dark', element: (<div className="fs-12">
      <Link to="#" className="text-fixed-white fw-semibold me-2 op-7">skip</Link>
      <Link to="#" className="text-fixed-white fw-semibold">open</Link>
    </div>)
  },
  {
    id: 4, icon: <svg className="flex-shrink-0 svg-white" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><g><g><path d="M15.73,3H8.27L3,8.27v7.46L8.27,21h7.46L21,15.73V8.27L15.73,3z M19,14.9L14.9,19H9.1L5,14.9V9.1L9.1,5h5.8L19,9.1V14.9z" /><rect height="6" width="2" x="11" y="7" /><rect height="2" width="2" x="11" y="15" /></g></g></g></svg>, color: 'danger', heading: 'Danger Alert', description: 'Danger alert to show the danger message', class: 'info', element: (<div className="fs-12">
      <Link to="#" className="text-fixed-white fw-semibold me-2 op-7">close</Link>
      <Link to="#" className="text-fixed-white fw-semibold">continue</Link>
    </div>)
  },
]

export const AdditionalContent = [
  { id: 1, color: 'primary' },
  { id: 2, color: 'secondary' },
  { id: 3, color: 'success' },
  { id: 4, color: 'warning' }
]


export const AlertwithIcon = [
  { id: 1, color: 'primary', icon: <svg className="flex-shrink-0 me-2 svg-primary" xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg> },
  { id: 2, color: 'success', icon: <svg className="flex-shrink-0 me-2 svg-success" xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" /><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg> },
  { id: 3, color: 'warning', icon: <svg className="flex-shrink-0 me-2 svg-warning" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><g><g><path d="M12,5.99L19.53,19H4.47L12,5.99 M12,2L1,21h22L12,2L12,2z" /><polygon points="13,16 11,16 11,18 13,18" /><polygon points="13,10 11,10 11,15 13,15" /></g></g></g></svg> },
  { id: 4, color: 'danger', icon: <svg className="flex-shrink-0 me-2 svg-danger" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><g><g><path d="M15.73,3H8.27L3,8.27v7.46L8.27,21h7.46L21,15.73V8.27L15.73,3z M19,14.9L14.9,19H9.1L5,14.9V9.1L9.1,5h5.8L19,9.1V14.9z" /><rect height="6" width="2" x="11" y="7" /><rect height="2" width="2" x="11" y="15" /></g></g></g></svg> }
]

export const CustomisedAlertwithIcon = [
  { id: 1, color: 'primary', icon: <svg className="svg-primary me-2" xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg> },
  { id: 2, color: 'secondary', icon: <svg className="svg-secondary me-2" xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg> },
  { id: 3, color: 'warning', icon: <svg className="svg-warning me-2" xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg> },
  { id: 4, color: 'danger', icon: <svg className="svg-danger me-2" xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"></path></svg> }
]

export const AlertwithImage = [
  { id: 1, image: ALLImages('face3'), color: 'primary' },
  { id: 2, image: ALLImages('face5'), color: 'secondary' },
  { id: 3, image: ALLImages('face8'), color: 'warning' },
  { id: 4, image: ALLImages('face11'), color: 'danger' },
  { id: 5, image: ALLImages('face13'), color: 'info' },
  { id: 6, image: ALLImages('face10'), color: 'light' },
  { id: 7, image: ALLImages('face15'), color: 'dark' }
]

export const AlertwithImagesize = [
  { id: 1, image: ALLImages('face3'), color: 'primary', size: 'xs' },
  { id: 2, image: ALLImages('face5'), color: 'secondary', size: 'sm' },
  { id: 3, image: ALLImages('face8'), color: 'warning', size: '' },
  { id: 4, image: ALLImages('face11'), color: 'danger', size: 'md' },
  { id: 5, image: ALLImages('face13'), color: 'info', size: 'lg' },
  { id: 6, image: ALLImages('face14'), color: 'light', size: 'xl' },
]

export const tooltipdata = [
  { id: 1, color: "primary", place: 'top' },
  { id: 2, color: "secondary", place: 'top' },
  { id: 3, color: "warning", place: 'top' },
  { id: 4, color: "info", place: 'left' },
  { id: 5, color: "success", place: 'top' },
  { id: 6, color: "danger", place: 'top' },
  { id: 7, color: "light", place: 'top' },
  { id: 8, color: "dark", place: 'left' }
]
export const popoverData = [
  { id: 1, color: "secondary", place: 'right' },
  { id: 2, color: "primary", place: 'top' },
  { id: 3, color: "info", place: 'bottom' },
  { id: 4, color: "warning", place: 'left' },
  { id: 5, color: "success", place: 'top' },
  { id: 6, color: "danger", place: 'left' },
]
export const ColoredpopoverData = [
  { id: 1, color: "secondary", place: 'right' },
  { id: 2, color: "primary", place: 'top' },
  { id: 3, color: "info", place: 'bottom' },
  { id: 4, color: "warning", place: 'left' },
  { id: 5, color: "success", place: 'top' },
  { id: 6, color: "danger", place: 'left' },
  { id: 7, color: "teal", place: 'right' },
  { id: 8, color: "purple", place: 'bottom' },
]
export const DismispopoverData = [
  { id: 1, color: "secondary", place: 'right'},
  { id: 2, color: "primary", place: 'top'},
  { id: 3, color: "info", place: 'top'},
  { id: 4, color: "warning", place: 'left' },
]

export const checkbox = [
  { name: 'checkbox 1', value: '1' },
  { name: 'checkbox 2', value: '2' },
  { name: 'checkbox 3', value: '3' },
];

export const Radio = [
  { name: 'Radio 1', value: '1' },
  { name: 'Radio 2', value: '2' },
  { name: 'Radio 3', value: '3' },
];

export const Radiovertical = [
  { name: 'Radio 1', value: '1' },
  { name: 'Radio 2', value: '2' },
  { name: 'Radio 3', value: '3' },
];

export const DropData = [
  {
    id: 'dropdown-basic-button',
    title: 'Dropdown button',
    color: 'primary',
    items: [
      { href: '#/action-1', text: 'Action' },
      { href: '#/action-2', text: 'Another action' },
      { href: '#/action-3', text: 'Something else' },
    ],
  },
  {
    id: 'dropdown-basic',
    title: 'Dropdown Link',
    color: 'secondary',
    items: [
      { href: '#/action-1', text: 'Action' },
      { href: '#/action-2', text: 'Another action' },
      { href: '#/action-3', text: 'Something else' },
    ],
  },
];



// export const TransactionData = [
//   { id: 1, TransID: '#1242232401', date: '03/12/2020', from: 'Olive Yew', to: 'Peg Legge', preview: ALLImages('face2'), coinpreview: ALLImages('svg3'), cointitle: 'Bitcoin', amount: '+0.041', status: 'COMPLETED', color: 'success' },
//   { id: 2, TransID: '#1242232402', date: '05/12/2020', from: 'Addie Minstra', to: 'Art Decco', preview: ALLImages('face3'), coinpreview: ALLImages('svg1'), cointitle: 'Ethereum', amount: '-0.344', status: 'CANCELED', color: 'danger' },
//   { id: 3, TransID: '#1242232403', date: '14/12/2020', from: 'Stan Dupp', to: 'Neil Down', preview: ALLImages('face4'), coinpreview: ALLImages('svg2'), cointitle: 'Ripple', amount: '-0.345', status: 'PENDING', color: 'muted' },
//   { id: 4, TransID: '#1242232404', date: '16/12/2020', from: 'Penny Black', to: 'Anna Domino', preview: ALLImages('face5'), coinpreview: ALLImages('svg5'), cointitle: 'Dash', amount: '+0.132', status: 'COMPLETED', color: 'success' },
//   { id: 5, TransID: '#1242232405', date: '18/12/2020', from: 'Phil Harmonic', to: 'Paul Misunday', preview: ALLImages('face6'), coinpreview: ALLImages('svg4'), cointitle: 'litecoin', amount: '-0.523', status: 'CANCELED', color: 'danger' },
//   { id: 6, TransID: '#1242232406', date: '20/12/2020', from: 'Arty Ficial', to: 'Marsha Mello', preview: ALLImages('face7'), coinpreview: ALLImages('svg7'), cointitle: 'Monero', amount: '-0.232', status: 'PENDING', color: 'muted' },
//   { id: 7, TransID: '#1242232407', date: '22/12/2020', from: 'Donatella Nobatti', to: 'Peg Legge', preview: ALLImages('face8'), coinpreview: ALLImages('svg9'), cointitle: 'Steem', amount: '+0.456', status: 'COMPLETED', color: 'success' },
//   { id: 8, TransID: '#1242232408', date: '25/12/2020', from: 'Juan Annatoo', to: 'Jack Dup', preview: ALLImages('face9'), coinpreview: ALLImages('svg6'), cointitle: 'Iota', amount: '+0.232', status: 'COMPLETED', color: 'success' },
//   { id: 9, TransID: '#1242232409', date: '25/12/2020', from: 'Stew Gots', to: 'Sara Bellum', preview: ALLImages('face10'), coinpreview: ALLImages('svg11'), cointitle: 'Waves', amount: '-0.232', status: 'PENDING', color: 'muted' },
//   { id: 10, TransID: '#1242232410', date: '28/12/2020', from: 'Anna Rexia', to: 'Marge Arita', preview: ALLImages('face11'), coinpreview: ALLImages('svg8'), cointitle: 'Neo', amount: '-0.344', status: 'CANCELED', color: 'danger' },
//   { id: 11, TransID: '#1242232411', date: '29/12/2020', from: 'Matt Innae', to: 'Barry Cuda', preview: ALLImages('face12'), coinpreview: ALLImages('svg10'), cointitle: 'Eos', amount: '-0.231', status: 'CANCELED', color: 'danger' },
//   { id: 12, TransID: '#1242232412', date: '30/12/2020', from: 'Gabe Lackmen', to: 'Marion Gaze', preview: ALLImages('face1'), coinpreview: ALLImages('svg13'), cointitle: 'Euros', amount: '+0.124', status: 'COMPLETED', color: 'success' },
//   { id: 13, TransID: '#1242232413', date: '31/12/2020', from: 'Jim Nasium', to: 'Marcus Down', preview: ALLImages('face2'), coinpreview: ALLImages('svg3'), cointitle: 'Bitcoin', amount: '-0.241', status: 'PENDING', color: 'muted' },
//   { id: 14, TransID: '#1242232414', date: '02/01/2021', from: 'Ella Vator', to: 'Gene Jacket', preview: ALLImages('face3'), coinpreview: ALLImages('svg1'), cointitle: 'Ethereum', amount: '+0.134', status: 'COMPLETED', color: 'success' },
//   { id: 15, TransID: '#1242232415', date: '04/01/2021', from: 'Bart Ender', to: 'Marty Graw', preview: ALLImages('face4'), coinpreview: ALLImages('svg2'), cointitle: 'Ripple', amount: '-0.244', status: 'PENDING', color: 'muted' },
// ]



export const cartData = [
  { id: 1, status: 'online', preview: ALLImages('face5'), spanElement: (<span className="text-muted fw-normal fs-12 header-notification-text">Oct 15 12:32pm</span>), element: (<span className="text-dark">Congratulate <strong>Olivia James</strong> for New template start</span>) },
  { id: 2, status: 'offline', preview: ALLImages('face2'), spanElement: (<span className="text-muted fw-normal fs-12 header-notification-text">Oct 13 02:56am</span>), element: (<span className="text-dark"><strong>Joshua Gray</strong> New Message Received</span>) },
  { id: 3, status: 'online', preview: ALLImages('face3'), spanElement: (<span className="text-muted fw-normal fs-12 header-notification-text">Oct 12 10:40pm</span>), element: (<span className="text-dark"><strong>Elizabeth Lewis</strong> added new schedule realease</span>) },
  { id: 4, status: 'online', preview: ALLImages('face5'), spanElement: (<span className="text-muted fw-normal fs-12 header-notification-text">Order <span className="text-warning">ID: #005428</span> had been placed</span>), element: (<span className="text-dark">Delivered Successful to <strong>Micky</strong> </span>) },
  { id: 5, status: 'offline', preview: ALLImages('face1'), spanElement: (<span className="text-muted fw-normal fs-12 header-notification-text">Today at 08:08pm</span>), element: (<span className="text-dark">You got 22 requests form <strong>Facebook</strong></span>) }
]


export const HeaderCart = [
  { id: 1, preview: ALLImages('ecommerce1'), itemName: 'Smart Watch', price: '$1,299.00', ulElement: (<ul className="header-product-item d-flex mb-0"> <li>Qty: 1</li> <li>Status: <span className="text-success">In Stock</span></li> </ul>) },
  { id: 2, preview: ALLImages('ecommerce3'), itemName: 'Flowers', price: '$179.29', ulElement: (<ul className="header-product-item d-flex mb-0"> <li>Qty: 2</li> <li><span className="badge bg-pink-transparent fs-10">Free shipping</span></li></ul>) },
  { id: 3, preview: ALLImages('ecommerce5'), itemName: 'Running Shoes', price: '$29.00', ulElement: (<ul className="header-product-item d-flex mb-0"> <li>Qty: 4</li> <li>Status: <span className="text-danger">Out Stock</span></li> </ul>) },
  { id: 4, preview: ALLImages('ecommerce4'), itemName: 'Furniture', price: '$4,999.00', ulElement: (<ul className="header-product-item d-flex mb-0"> <li>Gray</li> <li>50LB</li> </ul>) },
  { id: 5, preview: ALLImages('ecommerce6'), itemName: 'Tourist Bag', price: '$129.00', ulElement: (<ul className="header-product-item d-flex mb-0"> <li>Qty: 1</li> <li>Status: <span className="text-success">In Stock</span></li> </ul>) },
]

export const Data = [
  ["24-10-2022 12:47", "john", "john123@gmail.com", "#12012", "$1799", "1", "$1799"],
  ["12-09-2022 04:24", "mark", "markzenner23@gmail.com", "#12013", "$2479", "2", "$4958"],
  ["18-11-2022 18:43", "eoin", "eoin1992@gmail.com", "#12014", "$769", "1", "$769"],
  ["10-09-2022 10:35", "sarahcdd", "sarahcdd129@gmail.com", "#12015", "$1299", "3", "$3997"],
  ["27-10-2022 09:55", "afshin", "afshin@example.com", "#12016", "$1449", "1", "$1449"]
];

export const FixedHeaderData = [
  ["24-10-2022 12:47", "john", "john123@gmail.com", "#12012", "$1799", "1", "$1799"],
  ["12-09-2022 04:24", "mark", "markzenner23@gmail.com", "#12013", "$2479", "2", "$4958"],
  ["18-11-2022 18:43", "eoin", "eoin1992@gmail.com", "#12014", "$769", "1", "$769"],
  ["10-09-2022 10:35", "sarahcdd", "sarahcdd129@gmail.com", "#12015", "$1299", "3", "$3997"],
  ["27-10-2022 09:55", "afshin", "afshin@example.com", "#12016", "$1449", "1", "$1449"],
  ["24-10-2022 12:47", "john", "john123@gmail.com", "#12012", "$1799", "1", "$1799"],
  ["12-09-2022 04:24", "mark", "markzenner23@gmail.com", "#12013", "$2479", "2", "$4958"],
  ["18-11-2022 18:43", "eoin", "eoin1992@gmail.com", "#12014", "$769", "1", "$769"],
  ["10-09-2022 10:35", "sarahcdd", "sarahcdd129@gmail.com", "#12015", "$1299", "3", "$3997"],
  ["27-10-2022 09:55", "afshin", "afshin@example.com", "#12016", "$1449", "1", "$1449"],
  ["24-10-2022 12:47", "john", "john123@gmail.com", "#12012", "$1799", "1", "$1799"]
  
];