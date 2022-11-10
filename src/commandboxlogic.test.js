const CommandList = require("./commandboxlogic").CommandList;
const CommandListmut1 = require("./commandboxlogicmut1").CommandListmut1;
const CommandListmut2 = require("./commandboxlogicmut2").CommandListmut2;
const CommandListmut3 = require("./commandboxlogicmut3").CommandListmut3;
const CommandListbd1 = require("./commandboxlogicbd1").CommandListbd1;
//check if append() adds command to commandBox.list()

const runTestsFor = (CommandList) => {
  test("append", () => {
    //instantiating new CommandList object
    commandList = new CommandList();

    function appendToCommandBox(command) {
      commandList.append(command);
      return commandList.list[0];
    }

    expect(appendToCommandBox("command1")).toEqual("command1");
  });

  //check if prev() increments to prev position
  test("prev", () => {
    commandList = new CommandList();
    commandList.append("command1");
    commandList.append("command2");

    expect(commandList.prev()).toEqual("command1");
    expect(commandList.prev()).not.toEqual("command2");
    expect(commandList.prev()).toEqual("command1");
  });

  //check if next() increments to next position
  test("next", () => {
    commandList = new CommandList();
    commandList.append("command1");
    commandList.append("command2");
    commandList.prev();
    expect(commandList.next()).toEqual("command2");
    expect(commandList.next()).not.toEqual("command1");
    expect(commandList.next()).toEqual("command2");
  });
};

const runTestsForboundaries = (CommandList) => {
  test("append", () => {
    //instantiating new CommandList object
    commandList = new CommandList();

    function appendToCommandBox(command) {
      commandList.append(command);
      return commandList.list[0];
    }

    expect(appendToCommandBox("command1")).toEqual("command1");
  });

  //check if prev() increments to prev position
  test("prev", () => {
    commandList = new CommandList();
    commandList.append("command1");
    expect(commandList.prev()).toEqual("command1");
  });

  //check if next() increments to next position
  test("next", () => {
    commandList = new CommandList();
    commandList.append("command1");
    commandList.append("command2");
    commandList.next();
    commandList.next();
    expect(commandList.next()).toEqual("command2");
  });
};

// Mutation testing
// describe("original", () => {
//   runTestsFor(CommandList);
// });
// describe("mutation1", () => {
//   runTestsFor(CommandListmut1);
// });
// describe("mutation2", () => {
//   runTestsFor(CommandListmut2);
// });
// describe("mutation3", () => {
//   runTestsFor(CommandListmut3);
// });

describe("original", () => {
  runTestsForboundaries(CommandList);
});

describe("boundary 1", () => {
  runTestsForboundaries(CommandListbd1);
});
