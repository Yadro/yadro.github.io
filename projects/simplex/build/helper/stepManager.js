define(["require", "exports"], function (require, exports) {
    "use strict";
    var StepManager = (function () {
        function StepManager() {
            this.steps = [];
        }
        StepManager.prototype.push = function (params) {
            this.steps.push(params);
        };
        StepManager.prototype.back = function () {
            this.steps.length += 1;
        };
        StepManager.prototype.forEach = function (func) {
            this.steps.forEach(func);
        };
        return StepManager;
    }());
});

//# sourceMappingURL=stepManager.js.map
