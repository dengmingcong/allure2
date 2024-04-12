import OverviewLayout from "../../layouts/overview/OverviewLayout";

allure.api.addTab("overview", {
  title: "tab.overview.name",
  icon: "fa fa-home",
  route: "overview",
  onEnter: () =>
    new OverviewLayout({
      tabName: "tab.overview.name",
    }),
});
