const router = require("express").Router();
const { Journal } = require("../models");
const { ValidateSession } = require("../middleware");

router.get("/practice", function (req, res) {
  res.send("Hey! This is a practice route!");
});

router.post("/create", ValidateSession, (req, res) => {
  const journalEntry = {
    title: req.body.journal.title,
    date: req.body.journal.date,
    entry: req.body.journal.entry,
    owner: req.user.id,
  };
  Journal.create(journalEntry)
    .then((journal) => res.status(200).json(journal))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/", (req, res) => {
  Journal.findAll()
    .then((journals) => res.status(200).json(journals))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/mine", ValidateSession, (req, res) => {
  let userId = req.user.id;
  Journal.findAll({
    where: { owner: userId },
  })
    .then((journals) => res.status(200).json(journals))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:title", ValidateSession, (req, res) => {
  let title = req.params.title;

  Journal.findAll({
    where: { title: title },
  })
    .then((journals) => res.status(200).json(journals))
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/update/:entryId", ValidateSession, function (req, res) {
  const updateJournalEntry = {
    title: req.body.journal.title,
    date: req.body.journal.date,
    entry: req.body.journal.entry,
  };

  const query = { where: { id: req.params.entryId, owner: req.user.id } };

  Journal.update(updateJournalEntry, query)
    .then((journals) => res.status(200).json(journals))
    .then(
      Journal.findOne(query).then((journals) => res.status(200).json(journals))
    )
    .catch((err) => res.status(500).json({ error: err }));

  // Journal.findOne(query)
  // .then(journals => res.status(200).json(journals))
  // .catch(err => res.status(500).json({ error: err }));
});

router.delete("/delete/:id", ValidateSession, function (req, res) {
  const query = { where: { id: req.params.id, owner: req.user.id } };
  Journal.destroy(query)
    .then((journals) => {
      res.status(200).json(journals)
      console.log('Journal has been deleted')
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
