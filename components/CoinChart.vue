<template>
    <div>
        <div v-if="$vuetify.breakpoint.xsOnly">
            <template>
            <div class="text-left">
                <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    name="dateRange"
                    >
                    <v-icon left light> mdi-calendar </v-icon>
                    Date Range
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                    v-for="(theRange, index) in chartRanges"
                    :key="index"
                    >
                    <v-list-item-title @click="createChart(theRange.id)">{{
                        theRange.text
                    }}</v-list-item-title>
                    </v-list-item>
                </v-list>
                </v-menu>
            </div>
            </template>
        </div>
        <div v-else>
            <v-btn-toggle mandatory color="primary" name="chartDateRangeToggle">
            <v-btn
                v-for="theRange in chartRanges"
                :key="theRange.id"
                @click="createChart(theRange.id)"
                name="chartDateRange"
                >{{ theRange.text }}</v-btn
            >
            </v-btn-toggle>
        </div>
        <div v-if="chartLoading">
            <v-progress-linear
            indeterminate
            value="15"
            color="#2A9D8F"
            ></v-progress-linear>
        </div>
        <div class="coinChart" ref="chartdiv"></div>
    </div>
</template>

<script>
export default {
    props: {
        coinDetails: {
            type: Object,
            require: true,
        },
    },
    data() {
        return {
            coinGenesisDate: "",
            toDateRange: "",
            fromDateRange: "",
            currDateSelection: "",
            // indicator: '',
            // indicatorInterval: '',
            hourglass: "",
            prices: [],
            chartLoading: false,
            chartNumberFormatString: "",
            chartRanges: [
                { id: "24H", text: "24HR" },
                { id: "sevenD", text: "1W" },
                { id: "oneM", text: "1M" },
                { id: "threeM", text: "3M" },
                { id: "sixM", text: "6M" },
                { id: "ytd", text: "YTD" },
                { id: "max", text: "MAX" },
            ],
        }
    },
    created() {
        this.createChart('firstLoad');
    },
    mounted() {
        // let {am4core, am4charts, am4themes_animated} = this.$am4core();
    },
    beforeUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    },
    beforeRouteLeave() {
        this.chart.dispose();
    },
    methods: {
        async createChart(dateRange) {
            // console.log('Enter Create Chart...');
            this.chartLoading = true;

            if (this.currentDateRange !== dateRange) {
                const baseURL = `https://api.coingecko.com/api/v3/coins/${this.coinDetails.id}/market_chart/`;

                var apiParams = "";

                if (dateRange == "max") {
                    apiParams = `?vs_currency=usd&days=max&interval=monthly`;
                    // console.log(this.coinGenesisDate)
                    // this.fromDateRange = new Date(this.coinGenesisDate).getTime() / 1000
                    // this.fromDateRange = this.coinGenesisDate;
                } else {
                    this.setDateRangesUnix(dateRange);
                    apiParams = `range?vs_currency=usd&from=${this.fromDateRange}&to=${this.toDateRange}`;
                }

                var fullURL = baseURL + apiParams;
                // console.log(fullURL)

                try {
                    const res = await this.$axios.get(fullURL);
                    // console.log(res)

                    this.prices = res.data.prices;
                    this.marketCaps = res.data.market_caps;
                    this.totalVolumes = res.data.total_volumes;
                    this.fromDateRange = res.data.prices[0][0];
                    // console.log('The from date: ' + this.formatUnixDate(this.fromDateRange))
                    // console.log(this.marketCaps)
                    // console.log(this.totalVolumes)
                } catch (e) {
                    // console.log("ERROR");
                    console.log(e.response);
                    this.chartLoading = false;
                }

                this.formatChart();
                this.chartLoading = false;
            }
        },
    setDateRangesUnix(dateRange) {
      var myDate = new Date();

      // if it's the first load we will just set the chart to look a month back
      // we can adjust this later if 1 month back is unpopular
      if (dateRange === "firstLoad") {
        // console.log('Is first load!')

        this.toDateRange = Math.round(myDate.getTime() / 1000);
        // this.fromDateRange = Math.round((myDate.getDate() - 1)/ 1000);
        this.fromDateRange = Math.round(
          new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) / 1000
        );
        this.currDateSelection = "24H";
      } else if (dateRange === "24H") {
        this.toDateRange = Math.round(myDate.getTime() / 1000);
        // this.fromDateRange = Math.round((myDate.getDate() - 1)/ 1000);
        this.fromDateRange = Math.round(
          new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) / 1000
        );
        this.currDateSelection = "24H";
      } else if (dateRange === "sevenD") {
        this.toDateRange = Math.round(myDate.getTime() / 1000);
        this.fromDateRange = Math.round(
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000
        );
        this.currDateSelection = "sevenD";
      } else if (dateRange === "oneM") {
        this.toDateRange = Math.round(myDate.getTime() / 1000);
        this.fromDateRange = Math.round(
          myDate.setMonth(myDate.getMonth() - 1) / 1000
        );
        this.currDateSelection = "oneM";
      } else if (dateRange === "threeM") {
        this.toDateRange = Math.round(myDate.getTime() / 1000);
        this.fromDateRange = Math.round(
          myDate.setMonth(myDate.getMonth() - 3) / 1000
        );
        this.currDateSelection = "threeM";
      } else if (dateRange === "sixM") {
        this.toDateRange = Math.round(myDate.getTime() / 1000);
        this.fromDateRange = Math.round(
          myDate.setMonth(myDate.getMonth() - 6) / 1000
        );
        this.currDateSelection = "sixM";
      } else if (dateRange === "ytd") {
        this.toDateRange = Math.round(myDate.getTime() / 1000);
        this.fromDateRange = Math.round(
          myDate.setMonth(myDate.getMonth() - 12) / 1000
        );
        this.currDateSelection = "ytd";
      } else {
        alert("Date Range Error! Please try again.");
      }

      // return this.currentDate
    },
    formatChart() {
      // Clear the chart if it exists before creating another one!
      if (this.chart) {
        // console.log('Disposing chart.....');
        this.chart.dispose();
      }
      let {am4core, am4charts, am4themes_animated} = this.$am4core();

      am4core.useTheme(am4themes_animated);

      let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
      chart = this.showChartIndicator(chart);

      chart.numberFormatter.smallNumberThreshold = 0.000000000001;
      chart.tapToActivate = true;

      chart.preloader.disabled = true;

      // chart.paddingRight = 20;

      let data = [];
    //   console.log(this.prices)

      this.chartNumberSampling = this.prices[0][1];
      this.setTooltipPrice(this.chartNumberSampling);
      // console.log('Sampling: ' + this.chartNumberSampling)

      for (let i = 1; i < this.prices.length; i++) {
        data.push({
          // first el in prices is date, second is price!
          date: this.prices[i][0],
          // name: "name" + i,
          value: this.prices[i][1],
        });
      }

      chart.data = data;

      chart.responsive.enabled = true;
      chart.responsive.useDefault = false;

      chart.responsive.rules.push({
        relevant: function (target) {
          if (target.pixelWidth <= 400) {
            return true;
          }

          return false;
        },
        state: function (target, stateId) {
          let state = "";

          if (target instanceof am4charts.Chart) {
            state = target.states.create(stateId);
            state.properties.paddingTop = 0;
            state.properties.paddingRight = 15;
            state.properties.paddingBottom = 5;
            state.properties.paddingLeft = 15;
            return state;
          }

          if (target instanceof am4core.Scrollbar) {
            state = target.states.create(stateId);
            state.properties.marginBottom = -10;
            return state;
          }

          return null;
        },
      });

      let title = chart.titles.create();
      title.text = this.coinDetails.name;
      title.fontSize = 30;

      let topContainer = chart.chartContainer.createChild(am4core.Container);
      topContainer.layout = "absolute";
      topContainer.toBack();
      topContainer.paddingBottom = 0;
      topContainer.width = am4core.percent(100);

      let dateTitle = topContainer.createChild(am4core.Label);
      // console.log(this.fromDateRange)
      // console.log(this.toDateRange)
      dateTitle.text =
        this.formatUnixDate(this.fromDateRange) +
        " to " +
        this.formatUnixDate(this.toDateRange);
      dateTitle.fontWeight = 600;
      dateTitle.align = "right";

      let watermark = new am4core.Image();
      watermark.href = this.coinDetails.image.large;
      chart.plotContainer.children.push(watermark);
      watermark.align = "right";
      watermark.valign = "bottom";
      watermark.opacity = 0.4;
      watermark.marginRight = 10;
      watermark.marginBottom = 5;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.tooltip.disabled = true;
      // Disables the vertical lines...
      dateAxis.renderer.grid.template.disabled = true;

      // dateAxis.tooltipDateFormat = "yyyy-MM-dd";

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 5;

      // valueAxis.adjustLabelPrecision = false;

      valueAxis.numberFormatter = new am4core.NumberFormatter();
      valueAxis.numberFormatter.numberFormat = this.chartNumberFormatString;

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";

      let tooltipPriceFormatString = this.chartNumberFormatString;

      series.tooltipText =
        "[bold]{dateX.formatDate('MMM, dd yyyy')}[/]\n[bold]Price:[/] {valueY.formatNumber('" +
        tooltipPriceFormatString +
        "')}";

      series.tooltip.autoTextColor = false;
      series.tooltip.label.fill = am4core.color("#000");

      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color("#E9C46A");

      series.strokeWidth = 3;
      series.stroke = am4core.color("#2A9D8F");

      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      this.chart = chart;
      // this.hideIndicator();
    },
    setTooltipPrice(samplingPrice) {
      if ((samplingPrice < 1) & (samplingPrice >= 0.001)) {
        this.chartNumberFormatString = "$#,###.00000";
      } else if ((samplingPrice < 0.001) & (samplingPrice >= 0.0001)) {
        this.chartNumberFormatString = "$#,###.000000";
      } else if ((samplingPrice < 0.0001) & (samplingPrice >= 0.00001)) {
        this.chartNumberFormatString = "$#,###.0000000";
      } else if ((samplingPrice < 0.00001) & (samplingPrice >= 0.000001)) {
        this.chartNumberFormatString = "$#,###.00000000";
      } else if ((samplingPrice < 0.000001) & (samplingPrice >= 0.0000001)) {
        this.chartNumberFormatString = "$#,###.000000000";
      } else if ((samplingPrice < 0.0000001) & (samplingPrice >= 0.00000001)) {
        this.chartNumberFormatString = "$#,###.0000000000";
      } else {
        this.chartNumberFormatString = "$#,###.00";
      }

      return this.chartNumberFormatString;
    },
    showChartIndicator(theChart) {
      let {am4core, am4charts, am4themes_animated} = this.$am4core();
      let indicator = "";
      let indicatorInterval = "";
      let hourglass = "";

      theChart.events.on("ready", function (ev) {
        indicator.hide();
      });

      if (!indicator) {
        indicator = theChart.tooltipContainer.createChild(am4core.Container);
        indicator.background.fill = am4core.color("#fff");
        indicator.background.fillOpacity = 0.6;
        indicator.width = am4core.percent(100);
        indicator.height = am4core.percent(100);

        let indicatorLabel = indicator.createChild(am4core.Label);
        if (this.coinDetails.name) {
          indicatorLabel.text = `Finalizing ${this.coinDetails.name} Chart...`;
        } else {
          indicatorLabel.text = `Finalizing Chart...`;
        }

        indicatorLabel.align = "center";
        indicatorLabel.valign = "middle";
        indicatorLabel.fontSize = 20;
        indicatorLabel.dy = 50;

        hourglass = indicator.createChild(am4core.Image);
        hourglass.href = this.coinImage;
        hourglass.align = "center";
        hourglass.valign = "middle";
        hourglass.horizontalCenter = "middle";
        hourglass.verticalCenter = "middle";
        hourglass.scale = 0.7;
      }

      indicator.hide(0);
      indicator.show();

      clearInterval(indicatorInterval);
      indicatorInterval = setInterval(function () {
        hourglass.animate(
          [
            {
              from: 0,
              to: 360,
              property: "rotation",
            },
          ],
          1000
        );
      }, 2000);

      return theChart;
    },
    formatUnixDate(theUnixDate) {
      // Unixtimestamp
      var unixtimestamp = theUnixDate.toString().substring(0, 10);

      // Months array
      var months_arr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Convert timestamp to milliseconds
      var date = new Date(unixtimestamp * 1000);

      // Year
      var year = date.getFullYear();

      // Month
      var month = months_arr[date.getMonth()];

      // Day
      var day = date.getDate();
      // Display date time in MM-dd-yyyy h:m:s format
      var convdataTime = month + "-" + day + "-" + year;

      return convdataTime;
    },
    }

}
</script>

<style scoped>
.coinChart {
  width: 100%;
  height: 500px;
  background: lightgray;
}
</style>