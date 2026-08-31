// ============================================================================
//  Compatibility shim: break_eternity.js "Decimal" API over ExpantaNum.js
//  ---------------------------------------------------------------------------
//  This game (and the "The Modding Tree" framework) is written against the
//  break_eternity.js `Decimal` API. ExpantaNum.js provides a very similar but
//  not identical API. This file aliases `Decimal` to ExpantaNum and patches the
//  small number of behavioural differences the game depends on.
//
//  It MUST be loaded AFTER ExpantaNum.js and BEFORE any game/framework code.
// ============================================================================

(function () {
    "use strict"

    var EN = (typeof window !== "undefined" && window.ExpantaNum) ||
              (typeof globalThis !== "undefined" && globalThis.ExpantaNum) ||
              (typeof ExpantaNum !== "undefined" ? ExpantaNum : undefined)

    if (typeof EN !== "function") {
        throw new Error("ExpantaNum.js must be loaded before decimal-shim.js")
    }

    // --- 1. Alias the constructor so `new Decimal(...)`, `instanceof Decimal`,
    //        and static calls (Decimal.pow, Decimal.add, ...) keep working. ---
    var Decimal = EN

    // --- 2. Fix `.log(base)` semantics -------------------------------------
    //   break_eternity: x.log(base) = log of x in the given base.
    //   ExpantaNum:     x.log() is natural log and IGNORES a base argument.
    //   The game/framework call .log(base) pervasively, so delegate to the
    //   correct base-aware function.
    var origLog = EN.prototype.log

    function isE(v) {
        return v === Math.E || (v && typeof v.eq === "function" && v.eq(EN.E))
    }

    EN.prototype.log = function (base) {
        if (base === undefined || base === null || isE(base)) {
            return origLog.call(this)              // natural log
        }
        if (base === 10 || (typeof base === 'object' && base.eq && base.eq(10))) {
            return this.log10()                    // log base 10
        }
        return this.logBase(base)                  // any other base
    }

    // --- 3. Add a `.mag` getter like break_eternity -------------------------
    //   break_eternity's `.mag` is the exponent at the (zero-th) layer.
    //   NumberFormating.js reads `num.mag` to pick small-number formatting and
    //   to detect NaN / Infinity. Approximate via log10 (as a JS number).
    Object.defineProperty(EN.prototype, 'mag', {
        configurable: true,
        enumerable: false,
        get: function () {
            if (this.isNaN()) return NaN
            if (this.eq(EN.POSITIVE_INFINITY)) return Number.POSITIVE_INFINITY
            if (this.eq(EN.NEGATIVE_INFINITY)) return Number.NEGATIVE_INFINITY
            var n = this.log10().toNumber()
            if (!isFinite(n)) {
                // log10(0) = -Infinity -> mag(-Infinity) like break_eternity (small-number path).
                // log10 of a huge finite value can overflow to +Infinity -> keep it a huge
                // finite-readable number so format() doesn't mistake it for Infinity.
                return n === Number.NEGATIVE_INFINITY
                    ? Number.NEGATIVE_INFINITY
                    : Number.MAX_VALUE
            }
            return n
        }
    })

    // --- 4. Export globals the game / framework expect -----------------------
    if (typeof window !== "undefined") {
        window.Decimal = Decimal
        window.ExpantaNum = EN
    }
    if (typeof globalThis !== "undefined") {
        globalThis.Decimal = Decimal
        globalThis.ExpantaNum = EN
    }
    if (typeof module !== "undefined" && module.exports) {
        module.exports = Decimal
    }
})()
