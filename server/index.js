const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04018b266bfa06d4d7db2e06f69b281267d2ed5a6a661ee4c060769f7fc14943e826cf5edee6331fb4b761a3167a2576574c9111070d7099e25838676634b96d20": 100,
  "040842534876aa709c56e0e0acbb1df1900351cf7cf98a438badf3014c5f492443ccc42adb3226e24a728bcb0a523584e01ae77ed3b14ddc348918cd9b074c07d9": 100,
  "046b4a2f445c934d68fa78627bf4263046fb50cb8f922d691878cf13964744e74580c3a32e19c653bd96da46d6a3d459ed7dde091f0a7d70deffc296b3b772b9c5": 100,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO -> Get a Signature from the client-side application
  // recover  the public address from the signature

  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
