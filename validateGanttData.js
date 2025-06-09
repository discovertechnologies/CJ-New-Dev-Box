function validateGanttData(model) {
  // 1. Handle null or undefined model
  if (model === null || model === undefined) {
    console.error("Error: Model is null or undefined.");
    return false;
  }

  // 2. NodeDataArray Check
  if (!model.nodeDataArray || !Array.isArray(model.nodeDataArray)) {
    console.error("Error: model.nodeDataArray is missing or not an array.");
    return false;
  }
  if (model.nodeDataArray.length === 0) {
    console.error("Error: model.nodeDataArray is empty.");
    return false;
  }

  // 3. Node Property Check
  const requiredNodeProperties = ["key", "text", "start", "duration"];
  for (const node of model.nodeDataArray) {
    for (const property of requiredNodeProperties) {
      if (!node.hasOwnProperty(property)) {
        console.error(
          `Error: Node ${node.key || "with unknown key"} is missing required property: ${property}.`
        );
        return false;
      }
    }
  }

  // 4. LinkDataArray and Link Validation (if linkDataArray exists)
  if (model.linkDataArray && Array.isArray(model.linkDataArray)) {
    const nodeKeys = new Set(model.nodeDataArray.map(node => node.key));
    for (const link of model.linkDataArray) {
      if (!link.from || !nodeKeys.has(link.from)) {
        console.error(
          `Error: Link refers to a non-existent 'from' node: ${link.from}.`
        );
        return false;
      }
      if (!link.to || !nodeKeys.has(link.to)) {
        console.error(
          `Error: Link refers to a non-existent 'to' node: ${link.to}.`
        );
        return false;
      }
    }
  }

  // 5. Return True
  return true;
}

module.exports = validateGanttData;
