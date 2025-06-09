const validateGanttData = require('../validateGanttData.js');

describe('validateGanttData', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Spy on console.error and provide a mock implementation
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the original console.error implementation
    consoleErrorSpy.mockRestore();
  });

  // 1. A valid model
  test('should return true for a valid model', () => {
    const validModel = {
      nodeDataArray: [
        { key: 'N1', text: 'Node 1', duration: '5 days', start: '2023-10-26' },
        { key: 'N2', text: 'Node 2', duration: '3 days', start: '2023-10-31' },
      ],
      linkDataArray: [
        { from: 'N1', to: 'N2' },
      ],
    };
    expect(validateGanttData(validModel)).toBe(true);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  // 2. A broken link (missing 'from' node)
  test('should return false for a broken link', () => {
    const modelWithMissingFromNode = {
      nodeDataArray: [
        { key: 'N2', text: 'Node 2', duration: '3 days', start: '2023-10-31'},
      ],
      linkDataArray: [
        { from: 'N1', to: 'N2'}, // N1 does not exist
      ],
    };
    expect(validateGanttData(modelWithMissingFromNode)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // New test for missing 'to' node
  test('should return false for a link with a missing \'to\' node', () => {
    const modelWithMissingToNode = {
      nodeDataArray: [
        { key: 'N1', text: 'Node 1', duration: '5 days', start: '2023-10-26' },
      ],
      linkDataArray: [
        { from: 'N1', to: 'N2' }, // N2 does not exist
      ],
    };
    expect(validateGanttData(modelWithMissingToNode)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // 3. A node with missing properties
  test('should return false if a node is missing the duration property', () => {
    const missingPropertyModel = {
      nodeDataArray: [
        { key: 'N1', text: 'Node 1', start: '2023-10-26' }, // Duration is missing
        { key: 'N2', text: 'Node 2', duration: '3 days', start: '2023-10-31' },
      ],
      linkDataArray: [],
    };
    expect(validateGanttData(missingPropertyModel)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // 4. An empty nodeDataArray
  test('should return false for an empty nodeDataArray', () => {
    const emptyNodeDataModel = {
      nodeDataArray: [],
      linkDataArray: [],
    };
    expect(validateGanttData(emptyNodeDataModel)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // 5. Null or undefined model input
  test('should return false for null model input', () => {
    expect(validateGanttData(null)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test('should return false for undefined model input', () => {
    expect(validateGanttData(undefined)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // Test for model.nodeDataArray missing
  test('should return false if model.nodeDataArray is missing', () => {
    const modelMissingNodeDataArray = {
      linkDataArray: [],
    };
    expect(validateGanttData(modelMissingNodeDataArray)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // Test for model.nodeDataArray not being an array
  test('should return false if model.nodeDataArray is not an array', () => {
    const modelNodeDataArrayNotArray = {
      nodeDataArray: "not an array",
      linkDataArray: [],
    };
    expect(validateGanttData(modelNodeDataArrayNotArray)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // Test for a node missing 'key' property
  test('should return false if a node is missing the key property', () => {
    const modelMissingKeyProperty = {
      nodeDataArray: [
        { text: 'Node 1', duration: '5 days', start: '2023-10-26' },
      ],
    };
    expect(validateGanttData(modelMissingKeyProperty)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // Test for a node missing 'text' property
  test('should return false if a node is missing the text property', () => {
    const modelMissingTextProperty = {
      nodeDataArray: [
        { key: 'N1', duration: '5 days', start: '2023-10-26' },
      ],
    };
    expect(validateGanttData(modelMissingTextProperty)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // Test for a node missing 'start' property
  test('should return false if a node is missing the start property', () => {
    const modelMissingStartProperty = {
      nodeDataArray: [
        { key: 'N1', text: 'Node 1', duration: '5 days' },
      ],
    };
    expect(validateGanttData(modelMissingStartProperty)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // Test for linkDataArray not being an array (but exists)
  test('should return true if model.linkDataArray exists but is not an array (should be ignored)', () => {
    const modelLinkDataArrayNotArray = {
      nodeDataArray: [
        { key: 'N1', text: 'Node 1', duration: '5 days', start: '2023-10-26' },
      ],
      linkDataArray: "not an array", // This should be treated as if no links are present or handled gracefully
    };
    // According to the implementation, if linkDataArray is not an array, it's skipped.
    expect(validateGanttData(modelLinkDataArrayNotArray)).toBe(true);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  // Test for link object missing 'from' property
  test('should return false if a link is missing the from property', () => {
    const modelLinkMissingFromProperty = {
      nodeDataArray: [
        { key: 'N1', text: 'Node 1', duration: '5 days', start: '2023-10-26' },
        { key: 'N2', text: 'Node 2', duration: '3 days', start: '2023-10-31'},
      ],
      linkDataArray: [
        { to: 'N2' }, // 'from' property is missing
      ],
    };
    expect(validateGanttData(modelLinkMissingFromProperty)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // Test for link object missing 'to' property
  test('should return false if a link is missing the to property', () => {
    const modelLinkMissingToProperty = {
      nodeDataArray: [
        { key: 'N1', text: 'Node 1', duration: '5 days', start: '2023-10-26' },
        { key: 'N2', text: 'Node 2', duration: '3 days', start: '2023-10-31'},
      ],
      linkDataArray: [
        { from: 'N1' }, // 'to' property is missing
      ],
    };
    expect(validateGanttData(modelLinkMissingToProperty)).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

});
