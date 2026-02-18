// Usage Examples
// 

/*
import * as utils from 'path/to/this/folder/_.js';

utils.console.start({id: log_id, title: `ChatGPT`});
utils.console.log({id: log_id, message: 'a message here', payload: { model, prompt } });
utils.console.end({ id: log_id });

utils.hench.string.valid( completion?.choices?.[0]?.message?.content );
utils.hench.number.valid( ( await db__esnr_last_synced_at({}) )?.[0]?.last_synced_at );
const event_ids = utils.hench.array.valid( await db__esnr_event_ids_for_zoom({}) )
                            .map(e => e.event_id)
                            .filter(e => !!e)
                            .sort();

const response = await fetch( url, {
                    method: 'POST',
                    body: utils.hench.object.to_json({
                        page: 1,
                        size: 500,
                        search: [],
                        orderby: [
                            'updated_at',
                            'DESC',
                        ],
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': cookies,
                    },
                    redirect: 'follow',
            });
const text = await response.text();
// utils.console.log({ id: log_id, message: `Response as Text`, payload: text });
const json = utils.hench.object.from_json( text );
// utils.console.log({ id: log_id, message: `Response as Json`, payload: json });
const records = utils.hench.array.valid( json.items );

const name_first = utils.linguist.sanitize( record['first_name'], ['clean:::minify', 'latinize','case:::title:::en'] );
const phone = utils.linguist.sanitize( phone, ['phone'] );
*/

export * as hench from './hench/_.js';
export * as linguist from './linguist/_.js';
export * as console from './console/_.js';
export * as shell from './shell/_.js';