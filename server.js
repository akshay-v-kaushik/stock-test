const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
app.use(express.json());

const port = 8080;
const polygon = "odGvO2hxcYQjmCZTMefTJKrbO3AA6vfY";
const finnhub = "cmvfdohr01qog1iv3lfgcmvfdohr01qog1iv3lg0";

const path = require("path");
app.use(express.static(path.join(__dirname, "/build/")));

// ****** FINNHUB APIS
// company description
app.get("/company/desc/:id", async (req, res) => {
  const ticker = req.params.id;
  const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${finnhub}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching company description");
  }
});

//comapany historic data for charts
app.get("/company/history/years/:id", async (req, res) => {
  const ticker = req.params.id;
  const toDate = new Date();
  const fromDate = new Date();

  fromDate.setFullYear(fromDate.getFullYear() - 2);

  const todate = toDate.toISOString().split("T")[0];
  const fromdate = fromDate.toISOString().split("T")[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromdate}/${todate}?adjusted=true&sort=asc&apiKey=${polygon}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching company description");
  }
});

// hourly data polygon
app.get("/company/history/hours/:id", async (req, res) => {
  const ticker = req.params.id;
  let toDate, fromDate;
  if (req.query.todatetime) {
    // Assuming 'fromdatetime' is in YYYY-MM-DD format
    const toDatetime = parseInt(req.query.todatetime) * 1000;
    toDate = new Date(toDatetime);
  } else {
    toDate = new Date();
  }
  fromDate = new Date();
  fromDate.setDate(toDate.getDate() - 1);

  const formattedToDate = toDate.toISOString().split("T")[0];
  const formattedFromDate = fromDate.toISOString().split("T")[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/hour/${formattedFromDate}/${formattedToDate}?adjusted=true&sort=asc&apiKey=${polygon}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching company description");
  }
});

//company latest stock quote/price
app.get("/company/quote/:id", async (req, res) => {
  const ticker = req.params.id;
  const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${finnhub}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching company description");
  }
});

//search autocomplete
app.get("/search/autocomplete/:id", async (req, res) => {
  const ticker = req.params.id;
  const url = `https://finnhub.io/api/v1/search?q=${ticker}&token=${finnhub}`;
  try {
    const response = await axios.get(url);
    const filteredResults = response.data.result.filter(
      (item) => !item.symbol.includes(".")
    );
    res.json(filteredResults);
  } catch (error) {
    res.status(500).send("Error fetching company description");
  }
});

//company news
app.get("/company/news/:id", async (req, res) => {
  const ticker = req.params.id;

  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 6);
  fromDate.setDate(fromDate.getDate() - 1);
  const todate = toDate.toISOString().split("T")[0];
  const fromdate = fromDate.toISOString().split("T")[0];

  const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fromdate}&to=${todate}&token=${finnhub}`;
  try {
    const response = await axios.get(url);
    const validNews = response.data.filter(
      (item) =>
        item.image !== "" &&
        item.headline !== "" &&
        item.datetime &&
        item.url !== ""
    );
    validNews.sort((a, b) => b.datetime - a.datetime);
    const latestNews = validNews.slice(0, 20);
    res.json(latestNews);
  } catch (error) {
    res.status(500).send("Error fetching company description");
  }
});

//company recommendation
app.get("/company/recommendation/:id", async (req, res) => {
  const ticker = req.params.id;
  const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${finnhub}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching company description");
  }
});

//company insider sentiment
app.get("/company/sentiment/:id", async (req, res) => {
  const ticker = req.params.id;
  const url = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${ticker}&from=2022-01-01&token=${finnhub}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching company description");
  }
});

//company peers
app.get("/company/peers/:id", async (req, res) => {
  const ticker = req.params.id;
  const url = `https://finnhub.io/api/v1/stock/peers?symbol=${ticker}&token=${finnhub}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching company description");
  }
});

//comapny earnings
app.get("/company/earnings/:id", async (req, res) => {
  const ticker = req.params.id;
  const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${ticker}&token=${finnhub}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching company description");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
