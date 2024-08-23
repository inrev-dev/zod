"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const benchmark_1 = __importDefault(require("benchmark"));
const index_1 = require("../index");
function getlargeNestedSchema(type, numKeys) {
    const shape = {};
    const nestedShape = {};
    for (let i = 0; i < numKeys; i++) {
        shape[`key${i}`] = index_1.z.literal(i);
    }
    for (let i = 0; i < numKeys; i++) {
        nestedShape[`key${i}`] = index_1.z.literal(i);
    }
    shape.nested = index_1.z.object(nestedShape);
    shape.type = index_1.z.literal(type);
    return index_1.z.object(shape);
}
function getlargeNestedObj(type, schema) {
    const obj = {};
    Object.keys(schema.shape).forEach((key, i) => {
        if (key !== "nested" && key !== "type") {
            obj[key] = i;
        }
    });
    obj.nested = { ...obj };
    obj.type = type;
    return obj;
}
const doubleSuite = new benchmark_1.default.Suite("z.switch: double");
const manySuite = new benchmark_1.default.Suite("z.switch: many");
const doubleLargeNestedSuite = new benchmark_1.default.Suite("z.switch: double large nested");
const manyLargeNestedSuite = new benchmark_1.default.Suite("z.switch: many large nested");
const aSchema = index_1.z.object({
    type: index_1.z.literal("a"),
});
const objA = {
    type: "a",
};
const aLargeNestedSchema = getlargeNestedSchema("a", 20);
const largeNestedObjA = getlargeNestedObj("a", aLargeNestedSchema);
const bSchema = index_1.z.object({
    type: index_1.z.literal("b"),
});
const objB = {
    type: "b",
};
const bLargeNestedSchema = getlargeNestedSchema("b", 20);
const largeNestedObjB = getlargeNestedObj("b", bLargeNestedSchema);
const cSchema = index_1.z.object({
    type: index_1.z.literal("c"),
});
const objC = {
    type: "c",
};
const cLargeNestedSchema = getlargeNestedSchema("c", 20);
const largeNestedObjC = getlargeNestedObj("c", cLargeNestedSchema);
const dSchema = index_1.z.object({
    type: index_1.z.literal("d"),
});
const dLargeNestedSchema = getlargeNestedSchema("d", 20);
//@ts-expect-error
const double = index_1.z.switch(val => {
    switch (val.type) {
        case "a":
            return aSchema;
        case "b":
            return bSchema;
    }
});
//@ts-expect-error
const doubleLargeNested = index_1.z.switch(val => {
    switch (val.type) {
        case "a":
            return aLargeNestedSchema;
        case "b":
            return bLargeNestedSchema;
    }
});
//@ts-expect-error
const many = index_1.z.switch(val => {
    switch (val.type) {
        case "a":
            return aSchema;
        case "b":
            return bSchema;
        case "c":
            return cSchema;
        case "d":
            return dSchema;
    }
});
//@ts-expect-error
const manyLargeNested = index_1.z.switch(val => {
    switch (val.type) {
        case "a":
            return aLargeNestedSchema;
        case "b":
            return bLargeNestedSchema;
        case "c":
            return cLargeNestedSchema;
        case "d":
            return dLargeNestedSchema;
    }
});
doubleSuite
    .add("valid: a", () => {
    double.parse(objA);
})
    .add("valid: b", () => {
    double.parse(objB);
})
    .add("invalid: null", () => {
    try {
        double.parse(null);
    }
    catch (err) { }
})
    .add("invalid: wrong shape", () => {
    try {
        double.parse(objC);
    }
    catch (err) { }
})
    .on("cycle", (e) => {
    console.log(`${doubleSuite.name}: ${e.target}`);
});
manySuite
    .add("valid: a", () => {
    many.parse(objA);
})
    .add("valid: c", () => {
    many.parse(objC);
})
    .add("invalid: null", () => {
    try {
        many.parse(null);
    }
    catch (err) { }
})
    .add("invalid: wrong shape", () => {
    try {
        many.parse({ type: "unknown" });
    }
    catch (err) { }
})
    .on("cycle", (e) => {
    console.log(`${manySuite.name}: ${e.target}`);
});
doubleLargeNestedSuite
    .add("valid: a", () => {
    doubleLargeNested.parse(largeNestedObjA);
})
    .add("valid: b", () => {
    doubleLargeNested.parse(largeNestedObjB);
})
    .add("invalid: null", () => {
    try {
        doubleLargeNested.parse(null);
    }
    catch (err) { }
})
    .add("invalid: wrong shape", () => {
    try {
        doubleLargeNested.parse(largeNestedObjC);
    }
    catch (err) { }
})
    .on("cycle", (e) => {
    console.log(`${doubleLargeNestedSuite.name}: ${e.target}`);
});
manyLargeNestedSuite
    .add("valid: a", () => {
    manyLargeNested.parse(largeNestedObjA);
})
    .add("valid: c", () => {
    manyLargeNested.parse(largeNestedObjC);
})
    .add("invalid: null", () => {
    try {
        manyLargeNested.parse(null);
    }
    catch (err) { }
})
    .add("invalid: wrong shape", () => {
    try {
        manyLargeNested.parse({ type: "unknown" });
    }
    catch (err) { }
})
    .on("cycle", (e) => {
    console.log(`${manyLargeNestedSuite.name}: ${e.target}`);
});
exports.default = {
    suites: [doubleSuite, doubleLargeNestedSuite, manySuite, manyLargeNestedSuite],
};
