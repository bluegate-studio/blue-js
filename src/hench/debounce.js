import * as utils from '../_.js';

/**

utils.hench.debounce({
    callback: () => {},
    timeout_ms: 360,
    payload: {}
})( param_a, param_b, param_c, ... )

 */
export function timeout({ callback, timeout_ms, payload }) {
    let timeout;
    return (...params) => {
        // console.log( { params, payload } );
        if (timeout) { 
            clearTimeout( timeout ); }
        timeout = setTimeout(() => {
            callback({ payload, params });
        }, ( timeout_ms || 360 ));
    };
}

// export function debounce_by_frame( callback, payload ) {
//     let frame;
//     return (...params) => {
//         if (frame) { 
//             cancelAnimationFrame(frame); }
//         frame = requestAnimationFrame(() => callback({ payload, params }));
//     };
// }
export function frame({ callback, payload }) {
    let frame;
    const debounced = function(...params) {
        const context = this;  // Preserves calling context
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            callback.call(context, { payload, params });
        });
    };
    
    debounced.cancel = () => {
        if (frame) {
            cancelAnimationFrame(frame);
            frame = null;
        }
    };
    
    return debounced;
}