import TestResultModel from "../../data/testresult/TestResultModel";
import { className } from "../../decorators";
import EmptyView from "../empty/EmptyView";
import ErrorSplashView from "../error-splash/ErrorSplashView";
import SideBySideView from "../side-by-side/SideBySideView";
import TestResultView from "../testresult/TestResultView";
import TreeViewContainer from "../tree-view-container/TreeViewContainer";

@className("side-by-side")
class TestResultTreeView extends SideBySideView {
  initialize({ tree, routeState, csvUrl }) {
    super.initialize();
    this.csvUrl = csvUrl;
    this.tree = tree;
    this.routeState = routeState;
    this.listenTo(this.routeState, "change:treeNode", (_, treeNode) => this.showLeaf(treeNode));
  }

  showLeaf(treeNode) {
    if (treeNode && treeNode.testResult) {
      const baseUrl = `#${this.options.baseUrl}/${treeNode.testGroup}/${treeNode.testResult}`;
      const model = new TestResultModel({ uid: treeNode.testResult });
      model.fetch({
        success: () => {
          this.showChildView(
            "right",
            new TestResultView({ baseUrl, model, routeState: this.routeState }),
          )

          var allStatusDetailsElements = document.querySelectorAll(".status-details");

          // do nothing if only one status-details element exist
          if (allStatusDetailsElements.length > 1) {
            // hide top status-details element
            var topStatusDetailsElement = document.querySelector(".test-result-overview .status-details");
            topStatusDetailsElement.hidden = true;

            // get all stage elements
            var stageElements = document.querySelectorAll(".execution__content > .step");

            // iterate over stages
            for (let i = 0; i < stageElements.length; i++) {
                let stageElement = stageElements[i];

                // get non-step status-details element
                let stageNonStepStatusDetailsElement = stageElement.querySelector(":scope > .step__content > .status-details")
                let message = ""
                if (stageNonStepStatusDetailsElement) {
                    message = stageNonStepStatusDetailsElement.querySelector(".status-details__message").textContent.trim()
                }

                // get all step status-details elements
                let stageStepStatusDetailsElements = stageElement.querySelectorAll(":scope .step .status-details")

                // hide non-step status-details element if text equal
                for (let j = 0; j < stageStepStatusDetailsElements.length; j ++) {
                    let stepStatusDetailsElement = stageStepStatusDetailsElements[j];
                    let stepStatusDetailsMessage = stepStatusDetailsElement.querySelector(".status-details__message").textContent.trim();
                    if (stepStatusDetailsMessage === message) {
                        stageNonStepStatusDetailsElement.hidden = true;
                        break;
                    }
                }
            }
          }
        },
        error: () =>
          this.showChildView(
            "right",
            new ErrorSplashView({
              code: 404,
              message: `Test result with uid "${treeNode.testResult}" not found`,
            }),
          ),
      });
    } else {
      this.showChildView("right", new EmptyView({ message: "No item selected" }));
    }
  }

  onRender() {
    const { tabName, baseUrl } = this.options;
    const left = new TreeViewContainer({
      collection: this.tree,
      routeState: this.routeState,
      treeSorters: [],
      tabName: tabName,
      baseUrl: baseUrl,
      csvUrl: this.csvUrl,
    });
    this.showChildView("left", left);
  }

  templateContext() {
    return {
      cls: "testresult-tree",
    };
  }
}

export default TestResultTreeView;
