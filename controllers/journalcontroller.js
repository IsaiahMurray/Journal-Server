const chalk = require("chalk");
const router = require("express").Router();
const { JournalModel } = require("../models");
const {ValidateSession } = require("../middleware");

router.get("/practice", function (req, res) {
  res.send({
    message: "Hey! This is a practice route!",
  
  });
});

router.post("/create", ValidateSession, async (req, res) => {

  console.log(chalk.bgRedBright(`USER ID: ${req.user.id}`))
  const journalEntry = {
    title: req.body.title,
    date: req.body.date,
    entry: req.body.entry,
    owner: req.user.id,
  };
  try {
    const newJournal = await JournalModel.create(journalEntry);

    res.status(200).json({
      message: "Journal successfully created",
      newJournal,
    });
  } catch (err) {
    chalk.redBright(
      res.status(500).json({
        message: `Journal could not be created: ${err}`,
      })
    );
  }
});

router.get("/", async (req, res) => {
  try {
    const foundJournals = await JournalModel.findAll();

    res.status(200).json({
      message: "Journals successfully retrieved!",
      foundJournals,
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not retrieve journals: ${err}`,
    });
  }
});

router.get("/mine", ValidateSession, async (req, res) => {

  try {
    const foundJournals = await JournalModel.findAll({
      where: { owner: req.user.id },
    });

    res.status(200).json({
      message: "Journals successfully retrieved!",
      foundJournals,
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not retrieve journals: ${err}`,
    });
  }
});

router.get("/:title", ValidateSession, async (req, res) => {
  try {
    const foundJournals = await JournalModel.findAll({
      where: { title: req.params.title },
    });

    res.status(200).json({
      message: "Successfully retrieved!",
      foundJournals,
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not retrieve journals: ${err}`,
    });
  }
});

router.put("/edit/:entryId", ValidateSession, async (req, res) => {
  const { title, date, entry } = req.body;

  try {
    const updateEntry = await JournalModel.update(
      { title, date, entry },
      { where: { id: req.params.entryId, owner: req.user.id } }
    );

    res.status(200).json({
      message: "Journal has been updated!",
      updateEntry,
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not update journal: ${err}`,
    });
  }
});

router.delete("/delete/:id", ValidateSession, async (req, res) => {
  const query = { where: { id: req.params.id, owner: req.user.id } };

  try {
    const destroyedJournal = await JournalModel.destroy(query);
    res.status(200).json({
      message: "Journal has been destroyed!",
      destroyedJournal,
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not destroy journal: ${err}`,
    });
  }
});

module.exports = router;
