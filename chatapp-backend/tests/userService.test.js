const dbHandler = require("./db-handler");
const userService = require("../services/userService");
const User = require("../models/user");

describe("user service tests", () => {

  beforeAll(async () => await dbHandler.connect());

  beforeEach(async () => {
    const testData = require("./testData.json");
    await createTestUsers(testData);
  });

  afterEach(async () => await dbHandler.clearDatabase());

  afterAll(async () => await dbHandler.closeDatabase());

  // it("should test that true === true", () => {
  //   expect(true).toBe(true);
  // });

  it("should find all users", async () => {
    const users = await userService.getAllUsers();
    expect(users.length).toEqual(3);
  });

  it("should create a new user", async () => {
    const user = {
      username: "createdFromTest",
      password: "createdFromTest"
    };

    const returnedUser = await userService.createUser(user);

    expect(user.username).toEqual(returnedUser.username);
    expect(user.password).toEqual(returnedUser.password);

    const users = await userService.getAllUsers();
    expect(users.length).toEqual(4);
  });

});

const createTestUsers = async (testData) => {
  for (const user of testData.users) {
    const userToSave = new User(user);
    await userToSave.save();
  }
};
