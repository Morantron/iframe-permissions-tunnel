(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object.keys(descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object.defineProperty(target, property, desc);
      desc = null;
    }

    return desc;
  }

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var runtime = function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.

    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.

      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.

    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.


    var IteratorPrototype = {};

    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    exports.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;

        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }

      genFun.prototype = Object.create(Gp);
      return genFun;
    }; // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.


    exports.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      } // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).


      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };

    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.

    exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          } // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);

          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted; // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.

            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    } // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.


    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.

        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      } // The delegate iterator is finished, so forget it and continue with
      // the outer generator.


      context.delegate = null;
      return ContinueSentinel;
    } // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.


    defineIteratorMethods(Gp);
    Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      keys.reverse(); // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.

      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        } // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.


        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];

        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;
            return next;
          };

          return next.next = next;
        }
      } // Return an iterator with no values.


      return {
        next: doneResult
      };
    }

    exports.values = values;

    function doneResult() {
      return {
        value: undefined$1,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        this.prev = 0;
        this.next = 0; // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.

        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined$1;
        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },
      stop: function () {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;

        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },
      complete: function (record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        } // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.


        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    }; // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.

    return exports;
  }( // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {});

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }

  // unique enough identifier
  var chunk = function chunk() {
    return Math.round(Math.random() * Math.pow(2, 16)).toString(16).padStart(4, "0");
  };

  var uuid = function uuid() {
    return Array.from({
      length: 6
    }).map(chunk).join("-");
  };

  var onMessage = function onMessage(type, callback) {
    var enhancedCallback = function enhancedCallback(event) {
      var message;

      try {
        message = JSON.parse(event.data);
      } catch (e) {
        message = null;
      }

      if (!message || !message._iframe_permissions_tunnel || type !== "*" && message.type !== type) {
        return;
      }

      callback(message);
    };

    window.addEventListener("message", enhancedCallback);
    return function () {
      return window.removeEventListener("message", enhancedCallback);
    };
  };
  var onMessageOnce = function onMessageOnce(type, callback) {
    var unsubscribe = onMessage(type, function () {
      callback();
      unsubscribe();
    });
  };
  var postMessage = function postMessage(target, payload) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$wait = _ref.wait,
        wait = _ref$wait === void 0 ? false : _ref$wait;

    return new Promise(function (resolve, reject) {
      if (!payload.id) {
        var id = uuid();
        payload.id = id;
      }

      payload._iframe_permissions_tunnel = true;

      if (wait) {
        var unsubscribe = onMessage("*", function (message) {
          if (message.id === payload.id && "result" in message) {
            unsubscribe();
            resolve(message.result);
          }
        });
      } else {
        resolve();
      }

      target.postMessage(JSON.stringify(payload), "*");
    });
  };

  var waitMs = function waitMs(ms) {
    return new Promise(function (resolve) {
      return setTimeout(function () {
        return resolve("wait");
      }, ms);
    });
  };
  var timeout = function timeout(promise, ms) {
    return Promise.race([promise, waitMs(ms).then(function () {
      console.log("time out");
      throw new Error("TIMEOUT");
    })]);
  };

  var _class;

  var waitForEvent = function waitForEvent(eventType) {
    return new Promise(function (resolve) {
      window.addEventListener(eventType, function () {
        resolve(eventType);
      });
    });
  };

  var isInIframe = function () {
    try {
      return window.self !== window.parent;
    } catch (e) {
      return true;
    }
  }();

  var nullPermissionGranter = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", "granted");

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function nullPermissionGranter() {
      return _ref.apply(this, arguments);
    };
  }();

  var permissionGranter = DeviceMotionEvent.requestPermission || nullPermissionGranter;

  var serializeEvent = function serializeEvent(_ref2) {
    var alpha = _ref2.alpha,
        beta = _ref2.beta,
        gamma = _ref2.gamma;
    return {
      alpha: alpha,
      beta: beta,
      gamma: gamma
    };
  };
  /**
   * Calls the method on the parent iframe
   */


  var callOnTopFrame = function callOnTopFrame(target, key, descriptor) {
    var original = descriptor.value;

    if (isInIframe) {
      descriptor.value = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _len,
            args,
            _key,
            result,
            _args2 = arguments;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return target.waitForHandshake();

              case 2:
                for (_len = _args2.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = _args2[_key];
                }

                _context2.next = 5;
                return postMessage(window.parent, {
                  type: "method-call",
                  method: key,
                  args: args
                }, {
                  wait: true
                });

              case 5:
                result = _context2.sent;
                return _context2.abrupt("return", result);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
    }
  };

  var PermissionsTunnelClass = (_class = /*#__PURE__*/function () {
    function PermissionsTunnelClass() {
      _classCallCheck(this, PermissionsTunnelClass);

      this.callbacks = {};

      if (isInIframe) {
        this.waitForHandshake();
      }
    }

    _createClass(PermissionsTunnelClass, [{
      key: "onOrientationChange",
      value: function () {
        var _onOrientationChange = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(callback) {
          var _this = this;

          var isPermissionGranted;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return this.isPermissionGranted();

                case 2:
                  isPermissionGranted = _context3.sent;

                  if (isPermissionGranted) {
                    _context3.next = 6;
                    break;
                  }

                  console.warn("Could not add listener, permission not granted");
                  return _context3.abrupt("return");

                case 6:
                  if (isInIframe) {
                    this.registerCallback("deviceorientation", callback);
                    onMessage("deviceorientation-callback", function (_ref4) {
                      var args = _ref4.args;

                      _this.triggerCallbacks("deviceorientation", args);
                    });
                    this.setupEventForwarding();
                  } else {
                    window.addEventListener("deviceorientation", function (event) {
                      return callback(serializeEvent(event));
                    });
                  }

                case 7:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function onOrientationChange(_x) {
          return _onOrientationChange.apply(this, arguments);
        }

        return onOrientationChange;
      }()
    }, {
      key: "notifyPermissionPromptIsShown",
      value: function notifyPermissionPromptIsShown() {
        this.triggerCallbacks("permission:prompt-shown");
      }
    }, {
      key: "onPermissionPromptShown",
      value: function onPermissionPromptShown(cb) {
        this.registerCallback("permission:prompt-shown", cb);
      }
    }, {
      key: "onPermissionRequested",
      value: function onPermissionRequested(cb) {
        this.registerCallback("permission:requested", cb);
      }
    }, {
      key: "onPermissionGranted",
      value: function onPermissionGranted(cb) {
        this.registerCallback("permission:granted", cb);
      }
    }, {
      key: "onPermissionDenied",
      value: function onPermissionDenied(cb) {
        this.registerCallback("permission:denied", cb);
      }
    }, {
      key: "setupEventForwarding",
      value: function () {
        var _setupEventForwarding = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
          var _this2 = this;

          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  window.addEventListener("deviceorientation", function (event) {
                    postMessage(_this2.forwardTarget, {
                      type: "deviceorientation-callback",
                      args: [serializeEvent(event)]
                    });
                  });

                case 1:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function setupEventForwarding() {
          return _setupEventForwarding.apply(this, arguments);
        }

        return setupEventForwarding;
      }()
    }, {
      key: "isPermissionGranted",
      value: function () {
        var _isPermissionGranted = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
          var result;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.prev = 0;
                  _context5.next = 3;
                  return timeout(waitForEvent("deviceorientation"), 200);

                case 3:
                  result = true;
                  _context5.next = 10;
                  break;

                case 6:
                  _context5.prev = 6;
                  _context5.t0 = _context5["catch"](0);
                  console.error(_context5.t0);
                  result = false;

                case 10:
                  return _context5.abrupt("return", result);

                case 11:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, null, [[0, 6]]);
        }));

        function isPermissionGranted() {
          return _isPermissionGranted.apply(this, arguments);
        }

        return isPermissionGranted;
      }()
    }, {
      key: "requestPermission",
      value: function () {
        var _requestPermission = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
          var result;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  this.triggerCallbacks("permission:requested");
                  _context6.next = 3;
                  return permissionGranter();

                case 3:
                  result = _context6.sent;

                  if (result === "granted") {
                    this.triggerCallbacks("permission:granted");
                  } else {
                    this.triggerCallbacks("permission:denied");
                  }

                  return _context6.abrupt("return", result);

                case 6:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function requestPermission() {
          return _requestPermission.apply(this, arguments);
        }

        return requestPermission;
      }()
      /**
       * This makes the @callOnTopFrame decorator work
       */

    }, {
      key: "setupMethodForwading",
      value: function setupMethodForwading() {
        var _this3 = this;

        onMessage("method-call", /*#__PURE__*/function () {
          var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(message) {
            var method, args, result;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    method = message.method, args = message.args;
                    _context7.next = 3;
                    return _this3[method].apply(_this3, _toConsumableArray(args));

                  case 3:
                    result = _context7.sent;
                    postMessage(_this3.forwardTarget, {
                      type: "method-call-response",
                      id: message.id,
                      result: result
                    });
                    return _context7.abrupt("return", result);

                  case 6:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7);
          }));

          return function (_x2) {
            return _ref5.apply(this, arguments);
          };
        }());
      }
    }, {
      key: "waitForHandshake",
      value: function waitForHandshake() {
        var _this4 = this;

        return new Promise(function (resolve) {
          if (_this4.handshakeReceived) {
            resolve();
            return;
          }

          onMessageOnce("handshake", function (message) {
            _this4.handshakeReceived = true;
            postMessage(window.parent, {
              type: "handshake-ack"
            });
            resolve();
          });
        });
      }
    }, {
      key: "forwardTo",
      value: function forwardTo(target) {
        this.forwardTarget = target;
        this.setupMethodForwading();
        this.sendHandshake();
      }
    }, {
      key: "sendHandshake",
      value: function sendHandshake() {
        var _this5 = this;

        var interval = setInterval(function () {
          postMessage(_this5.forwardTarget, {
            type: "handshake"
          });
        }, 100);
        onMessageOnce("handshake-ack", function (message) {
          clearInterval(interval);
        });
      }
    }, {
      key: "registerCallback",
      value: function registerCallback(callbackName, callback) {
        if (!this.callbacks[callbackName]) {
          this.callbacks[callbackName] = [];
        }

        this.callbacks[callbackName].push(callback);
      }
    }, {
      key: "triggerCallbacks",
      value: function triggerCallbacks(callbackName) {
        var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        (this.callbacks[callbackName] || []).forEach(function (cb) {
          return cb(args);
        });
      }
    }]);

    return PermissionsTunnelClass;
  }(), (_applyDecoratedDescriptor(_class.prototype, "notifyPermissionPromptIsShown", [callOnTopFrame], Object.getOwnPropertyDescriptor(_class.prototype, "notifyPermissionPromptIsShown"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setupEventForwarding", [callOnTopFrame], Object.getOwnPropertyDescriptor(_class.prototype, "setupEventForwarding"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "isPermissionGranted", [callOnTopFrame], Object.getOwnPropertyDescriptor(_class.prototype, "isPermissionGranted"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "requestPermission", [callOnTopFrame], Object.getOwnPropertyDescriptor(_class.prototype, "requestPermission"), _class.prototype)), _class);
  var PermissionsTunnel = new PermissionsTunnelClass();

  var ready = function ready(cb) {
    // Check if the `document` is loaded completely
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", function (e) {
      cb();
    }) : cb();
  };

  var isInIframe$1 = function () {
    try {
      return window.self !== window.parent;
    } catch (e) {
      return true;
    }
  }();

  window.onerror = function (error) {
    return alert(error);
  };

  var topSetup = function topSetup() {
    var iframe = document.getElementById("iframe");
    PermissionsTunnel.forwardTo(iframe.contentWindow);
    PermissionsTunnel.onPermissionPromptShown(function () {
      iframe.style = "border: 2px dashed black; width: 100%; height: 100%;";
    });
    PermissionsTunnel.onPermissionDenied(function () {
      alert("permission denied");
      iframe.style = "border: 2px solid red; height: 100px;";
    });
    PermissionsTunnel.onPermissionGranted(function () {
      alert("permission granted");
      iframe.style = "border: 2px solid green; height: 100px;";
    });
  };

  var iframeSetup = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var output, isPermissionGranted, button;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              output = document.createElement("pre");
              document.body.appendChild(output);
              _context2.next = 4;
              return PermissionsTunnel.isPermissionGranted();

            case 4:
              isPermissionGranted = _context2.sent;

              if (!isPermissionGranted) {
                button = document.createElement("button");
                button.innerText = "Request permission";
                button.onclick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return PermissionsTunnel.requestPermission();

                        case 2:
                          PermissionsTunnel.onOrientationChange(function (event) {
                            output.innerText = JSON.stringify(event, null, 2);
                          });

                        case 3:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));
                document.body.appendChild(button);
                PermissionsTunnel.notifyPermissionPromptIsShown();
              } else {
                PermissionsTunnel.onOrientationChange(function (event) {
                  output.innerText = JSON.stringify(event, null, 2);
                });
              }

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function iframeSetup() {
      return _ref.apply(this, arguments);
    };
  }();

  if (isInIframe$1) {
    ready(iframeSetup);
  } else {
    ready(topSetup);
  }

})));
