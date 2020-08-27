const dbHandler = require("./db-handler");
const messageService = require("../services/messageService");
const Message = require("../models/message");

describe("message service tests", () => {

  beforeAll(async () => await dbHandler.connect());

  beforeEach(async () => {
    const testData = require("./testData.json");
    await createTestMessages(testData);
  });

  afterEach(async () => await dbHandler.clearDatabase());

  afterAll(async () => await dbHandler.closeDatabase());

  // it("should test that true === true", () => {
  //   expect(true).toBe(true);
  // });

  it("should find all messages", async () => {
    const messages = await messageService.getAllMessages();
    expect(messages.length).toEqual(3);
  });

  it("should create a new message", async () => {
    const message = {
      text: "createdFromTest"
    };

    const returnedMessage = await messageService.createMessage(message);

    expect(message.username).toEqual(returnedMessage.username);
    expect(message.password).toEqual(returnedMessage.password);

    const messages = await messageService.getAllMessages();
    expect(messages.length).toEqual(4);
  });

});

const createTestMessages = async (testData) => {
  for (const message of testData.messages) {
    const messageToSave = new Message(message);
    await messageToSave.save();
  }
};
