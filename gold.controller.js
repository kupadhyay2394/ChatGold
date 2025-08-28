const USER = require('./user.models.js');

// Fetch gold price
async function getGoldPrice() {
  try {
    const url = `https://api.metalpriceapi.com/v1/latest?api_key=cfe8782b1f49c80041e93d257117e577&base=USD&currencies=XAU`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.rates || !data.rates.XAU) {
      return null;
    }
    return parseFloat(data.rates.XAU);
  } catch (err) {
    console.error("Error fetching gold price:", err);
    return null;
  }
}

// ✅ Buy gold
async function buyGold(req, res) {
  try {
    
    
   
    
    const goldGram  = req.body; // expect { goldGram: "5" }
    const goldGram1 = parseFloat(goldGram.goldGram);
    console.log(goldGram);
    
    if (isNaN(goldGram1) || goldGram1 <= 0) {
      return res.status(400).json({ error: "Invalid gold amount" });
    }
    
     
    const price = await getGoldPrice();
    if (!price) {
      return res.status(500).json({ error: "Gold price unavailable" });
    }
    

    const totalPrice = goldGram1 * price;

    const user = await USER.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    console.log(Number(user.userWallet));
    
    if (totalPrice > Number(user.userWallet)) {
      return res.status(401).json({ error: "Insufficient balance" });
    }
   // console.log("in the buy");

    // ✅ Update balances
    user.userWallet = Number(user.userWallet) - totalPrice;
    user.userGold = Number(user.userGold) + goldGram1;

    await user.save();
 
  
    return res.status(201).json({
      message: "Gold purchase successful",
      wallet: user.userWallet,
      gold: user.userGold,
    });
  } catch (err) {
    console.error("Error in buyGold:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// ✅ Sell gold
async function sellGold(req, res) {
  try {
    const { goldGram } = req.body;
    const goldGram1 = parseFloat(goldGram);

    if (isNaN(goldGram1) || goldGram1 <= 0) {
      return res.status(400).json({ error: "Invalid gold amount" });
    }

    const price = await getGoldPrice();
    if (!price) {
      return res.status(500).json({ error: "Gold price unavailable" });
    }

    const totalValue = goldGram1 * price;

    const user = await USER.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (goldGram1 > Number(user.userGold)) {
      return res.status(401).json({ error: "Insufficient gold balance" });
    }

    // ✅ Update balances
    user.userGold = Number(user.userGold) - goldGram1;
    user.userWallet = Number(user.userWallet) + totalValue;

    await user.save();

    return res.status(201).json({
      message: "Gold sold successfully",
      wallet: user.userWallet,
      gold: user.userGold,
    });
  } catch (err) {
    console.error("Error in sellGold:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


async function addMoney(req, res) {
  try {
 
    
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
  
    const user = await USER.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
   
    user.userWallet += amount;
    await user.save();
    console.log(user);
    
    

    res.json({
      message: "Money added successfully",
      user,
    });
  } catch (err) {
    console.error("Error adding money:", err);
    res.status(500).json({ error: "Server error" });
  }
}


module.exports = { buyGold, sellGold,addMoney };
