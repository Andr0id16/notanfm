const addtwonumbers = require("./add").addtwonumbers;

test("the function will add two numbers", () => {
  expect(addtwonumbers(1, 2)).toEqual(3);
});
