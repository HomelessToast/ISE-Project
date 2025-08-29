// AUTO-GENERATED: computation orchestrator
import { NODES, NodeId, NodeDef } from './graph';
import * as F from './nodes.generated';

export type Value = number|string|boolean|null;
export type Context = Record<NodeId, Value>;

/**
 * Compute all nodes in topological order.
 * Provide initial context values for raw inputs (constants) as needed.
 * Returns a filled context map including the final 'Sheet1!K15' if present.
 */
export function compute(initial: Partial<Context> = {}, targetNode: string = 'Sheet1!K15'): Context {
  const ctx: Context = { ...(initial as any) } as Context;
  
  // Build a lookup of stubs
  const fns: Record<string, (ctx: any) => any> = {
    'Sheet1!C6': F.Sheet1_C6,
    'Sheet1!C8': F.Sheet1_C8,
    'Sheet1!C7': F.Sheet1_C7,
    'Sheet1!A6': F.Sheet1_A6,
    'Sheet1!A7': F.Sheet1_A7,
    'Sheet1!A8': F.Sheet1_A8,
    'Sheet1!B9': F.Sheet1_B9,
    'Sheet1!B5': F.Sheet1_B5,
    'Sheet1!D9': F.Sheet1_D9,
    'Sheet1!D5': F.Sheet1_D5,
    'Sheet1!B12': F.Sheet1_B12,
    'Sheet1!B24': F.Sheet1_B24,
    'Sheet1!B30': F.Sheet1_B30,
    'Sheet1!C24': F.Sheet1_C24,
    'Sheet1!C12': F.Sheet1_C12,
    'Sheet1!C30': F.Sheet1_C30,
    'Sheet1!I23': F.Sheet1_I23,
    'Sheet1!D30': F.Sheet1_D30,
    'Sheet1!D24': F.Sheet1_D24,
    'Sheet1!B38': F.Sheet1_B38,
    'Sheet1!D25': F.Sheet1_D25,
    'Sheet1!B39': F.Sheet1_B39,
    'Sheet1!D31': F.Sheet1_D31,
    'Sheet1!N2': F.Sheet1_N2,
    'Sheet1!I24': F.Sheet1_I24,
    'Sheet1!I25': F.Sheet1_I25,
    'Sheet1!B40': F.Sheet1_B40,
    'Sheet1!D26': F.Sheet1_D26,
    'Sheet1!N3': F.Sheet1_N3,
    'Sheet1!D32': F.Sheet1_D32,
    'Sheet1!D27': F.Sheet1_D27,
    'Sheet1!D33': F.Sheet1_D33,
    'Sheet1!I26': F.Sheet1_I26,
    'Sheet1!N4': F.Sheet1_N4,
    'Sheet1!B41': F.Sheet1_B41,
    'Sheet1!N33': F.Sheet1_N33,
    'Sheet1!N30': F.Sheet1_N30,
    'Sheet1!N28': F.Sheet1_N28,
    'Sheet1!N32': F.Sheet1_N32,
    'Sheet1!N31': F.Sheet1_N31,
    'Sheet1!N29': F.Sheet1_N29,
    'Sheet1!P17': F.Sheet1_P17,
    'Sheet1!O17': F.Sheet1_O17,
    'Sheet1!C5': F.Sheet1_C5,
    'Sheet1!C9': F.Sheet1_C9,
    'Sheet1!A9': F.Sheet1_A9,
    'Sheet1!A5': F.Sheet1_A5,
    'Sheet1!B4': F.Sheet1_B4,
    'Sheet1!D4': F.Sheet1_D4,
    'Sheet1!P22': F.Sheet1_P22,
    'Sheet1!O22': F.Sheet1_O22,
    'Sheet1!N22': F.Sheet1_N22,
    'Sheet1!D12': F.Sheet1_D12,
    'Sheet1!D13': F.Sheet1_D13,
    'Sheet1!E31': F.Sheet1_E31,
    'Sheet1!E25': F.Sheet1_E25,
    'Sheet1!N23': F.Sheet1_N23,
    'Sheet1!O23': F.Sheet1_O23,
    'Sheet1!P23': F.Sheet1_P23,
    'Sheet1!O24': F.Sheet1_O24,
    'Sheet1!N24': F.Sheet1_N24,
    'Sheet1!P24': F.Sheet1_P24,
    'Sheet1!D14': F.Sheet1_D14,
    'Sheet1!E26': F.Sheet1_E26,
    'Sheet1!E32': F.Sheet1_E32,
    'Sheet1!O25': F.Sheet1_O25,
    'Sheet1!N25': F.Sheet1_N25,
    'Sheet1!P25': F.Sheet1_P25,
    'Sheet1!E33': F.Sheet1_E33,
    'Sheet1!E27': F.Sheet1_E27,
    'Sheet1!D15': F.Sheet1_D15,
    'Sheet1!C4': F.Sheet1_C4,
    'Sheet1!A4': F.Sheet1_A4,
    'Sheet1!D3': F.Sheet1_D3,
    'Sheet1!K24': F.Sheet1_K24,
    'Sheet1!K25': F.Sheet1_K25,
    'Sheet1!K26': F.Sheet1_K26,
    'Sheet1!F30': F.Sheet1_F30,
    'Sheet1!F24': F.Sheet1_F24,
    'Sheet1!C3': F.Sheet1_C3,
    'Sheet1!A3': F.Sheet1_A3,
    'Sheet1!L6': F.Sheet1_L6,
    'Sheet1!J5': F.Sheet1_J5,
    'Sheet1!H4': F.Sheet1_H4,
    'Sheet1!H6': F.Sheet1_H6,
    'Sheet1!H5': F.Sheet1_H5,
    'Sheet1!J6': F.Sheet1_J6,
    'Sheet1!J4': F.Sheet1_J4,
    'Sheet1!K6': F.Sheet1_K6,
    'Sheet1!I6': F.Sheet1_I6,
    'Sheet1!I4': F.Sheet1_I4,
    'Sheet1!K5': F.Sheet1_K5,
    'Sheet1!I5': F.Sheet1_I5,
    'Sheet1!L5': F.Sheet1_L5,
    'Sheet1!E13': F.Sheet1_E13,
    'Sheet1!E15': F.Sheet1_E15,
    'Sheet1!E12': F.Sheet1_E12,
    'Sheet1!E14': F.Sheet1_E14,
    'Sheet1!E21': F.Sheet1_E21,
    'Sheet1!E19': F.Sheet1_E19,
    'Sheet1!E20': F.Sheet1_E20,
    'Sheet1!N17': F.Sheet1_N17,
    'Sheet1!E30': F.Sheet1_E30,
    'Sheet1!E18': F.Sheet1_E18,
    'Sheet1!E24': F.Sheet1_E24,
    'Sheet1!L24': F.Sheet1_L24,
    'Sheet1!L26': F.Sheet1_L26,
    'Sheet1!F12': F.Sheet1_F12,
    'Sheet1!F13': F.Sheet1_F13,
    'Sheet1!L23': F.Sheet1_L23,
    'Sheet1!F14': F.Sheet1_F14,
    'Sheet1!L25': F.Sheet1_L25,
    'Sheet1!F15': F.Sheet1_F15,
    'Sheet1!F18': F.Sheet1_F18,
    'Sheet1!P14': F.Sheet1_P14,
    'Sheet1!K28': F.Sheet1_K28,
    'Sheet1!I15': F.Sheet1_I15,
    'Sheet1!L10': F.Sheet1_L10,
    'Sheet1!J15': F.Sheet1_J15,
    'Sheet1!M10': F.Sheet1_M10,
    'Sheet1!J30': F.Sheet1_J30,
    'Sheet1!N10': F.Sheet1_N10,
    'Sheet1!O10': F.Sheet1_O10,
    'Sheet1!P10': F.Sheet1_P10,
    'Sheet1!K15': F.Sheet1_K15,
    'Sheet1!L15': F.Sheet1_L15,
    'Sheet1!K23': F.Sheet1_K23,
    'Sheet1!K4': F.Sheet1_K4,
    'Sheet1!L4': F.Sheet1_L4,
  };

  // Dev-only guard to fail fast when nodes are missing
  function requireInputOrFn(id: string, ctx: any, node: any) {
    // Skip validation for nodes with no formula (empty placeholders)
    if (!node.formula || node.formula === '') {
      return;
    }
    
    const hasInput = Object.prototype.hasOwnProperty.call(ctx, id);
    if (!hasInput && !fns[id]) {
      throw new Error(`Engine missing node & input: ${id}. Either implement the node or provide it as input.`);
    }
  }

  // Build dependency graph for the target node
  function buildDependencyGraph(targetId: string): Set<string> {
    const visited = new Set<string>();
    const toVisit = [targetId];
    
    while (toVisit.length > 0) {
      const currentId = toVisit.pop()!;
      if (visited.has(currentId)) continue;
      
      visited.add(currentId);
      const node = NODES.find(n => n.id === currentId);
      
      if (node && node.deps) {
        for (const depId of node.deps) {
          if (!visited.has(depId)) {
            toVisit.push(depId);
          }
        }
      }
    }
    
    return visited;
  }

  // Get only the nodes needed for the target
  const neededNodes = buildDependencyGraph(targetNode);
  console.log(`Computing ${neededNodes.size} nodes needed for ${targetNode}`);
  
  // Execute only the needed nodes in topological order
  for (const node of NODES) {
    if (!neededNodes.has(node.id)) {
      continue; // Skip nodes not needed for target
    }
    
    if (ctx[node.id] !== undefined) {
      continue; // Already computed
    }

    // Check if we have the function or input
    requireInputOrFn(node.id, ctx, node);

    try {
      if (fns[node.id]) {
        ctx[node.id] = fns[node.id](ctx);
      } else {
        throw new Error(`No function found for node ${node.id}`);
      }
    } catch (error) {
      console.error(`Error computing ${node.id}:`, error);
      throw error;
    }
  }

  return ctx;
}
