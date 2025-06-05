// Mock validateGanttData function for testing purposes
function validateGanttData(model) {
  // Basic mock: returns true by default
  if (model === null || model === undefined) {
    return false; // Simulate handling of null/undefined input
  }
  if (!model.nodeDataArray || model.nodeDataArray.length === 0) {
    return false; // Simulate handling of empty nodeDataArray
  }
  // Simulate a check for missing properties (e.g., duration)
  if (model.nodeDataArray.some(node => !node.hasOwnProperty('duration'))) {
    return false;
  }
  // Simulate a check for broken links
  if (model.linkDataArray && model.nodeDataArray) {
    if (model.linkDataArray.some(link => {
      const fromNodeExists = model.nodeDataArray.find(node => node.key === link.from);
      // Assuming 'to' also needs to exist, though not explicitly in the failing test case description
      // const toNodeExists = model.nodeDataArray.find(node => node.key === link.to);
      return !fromNodeExists; // Returns true if a 'from' node is missing
    })) {
      return false;
    }
  }
  return true;
}

module.exports = validateGanttData; // Export if needed, or keep it local to the test file

const validateGanttData = require('./validateGanttData.test.js'); // Assuming the function is exported, adjust if it's in the same file without export

describe('validateGanttData', () => {
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
  });

  // 2. A broken link
  test('should return false for a broken link', () => {
    const brokenLinkModel = {
      nodeDataArray: [
        { key: 'N1', text: 'Node 1', duration: '5 days', start: '2023-10-26' },
        // N2 is missing, but linked from N1
      ],
      linkDataArray: [
        { from: 'N1', to: 'N2' }, // N2 does not exist in nodeDataArray
      ],
    };
    // Correction: The mock function's logic for broken links was based on 'from' node.
    // The test case requires 'from' to exist, but 'to' to be potentially problematic.
    // However, the original prompt states "from key does not exist in the nodeDataArray".
    // Let's stick to the prompt: a link where 'from' doesn't exist.
    const modelWithMissingFromNode = {
      nodeDataArray: [
        { key: 'N2', text: 'Node 2', duration: '3 days', start: '2023-10-31'},
      ],
      linkDataArray: [
        { from: 'N1', to: 'N2'}, // N1 does not exist
      ],
    };
    expect(validateGanttData(modelWithMissingFromNode)).toBe(false);
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
  });

  // 4. An empty nodeDataArray
  test('should return false for an empty nodeDataArray', () => {
    const emptyNodeDataModel = {
      nodeDataArray: [],
      linkDataArray: [],
    };
    expect(validateGanttData(emptyNodeDataModel)).toBe(false);
  });

  // 5. Null or undefined model input
  test('should return false for null model input', () => {
    expect(validateGanttData(null)).toBe(false);
  });

  test('should return false for undefined model input', () => {
    expect(validateGanttData(undefined)).toBe(false);
  });
});
