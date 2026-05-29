import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const submit_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("New application submission:", body);
  return { success: true };
});

export { submit_post as default };
//# sourceMappingURL=submit.post.mjs.map
