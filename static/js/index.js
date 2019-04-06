var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pagination = function (_React$Component) {
  _inherits(Pagination, _React$Component);

  function Pagination(props) {
    _classCallCheck(this, Pagination);

    return _possibleConstructorReturn(this, (Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call(this, props));
  }

  _createClass(Pagination, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // set page if items array isn't empty
      if (this.props.items && this.props.items.length) {
        this.setPage(this.props.initialPage);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      // reset page if items array has changed
      if (this.props.items !== prevProps.items) {
        this.setPage(this.props.initialPage);
      }
    }
  }, {
    key: "setPage",
    value: function setPage(page) {
      var _props = this.props,
          items = _props.items,
          pageSize = _props.pageSize,
          pager = _props.pager;


      if (page < 1 || page > pager.totalPages) {
        return;
      }

      // get new pager object for specified page
      pager = this.props.getPager(items.length, page, pageSize);

      // get new page of items from items array
      var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

      // call change page function in parent component
      this.props.onChangePage(pageOfItems);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var pager = this.props.pager;

      if (!pager.pages || pager.pages.length <= 1) {
        // don't display pager if there is only 1 page
        return null;
      }

      return React.createElement(
        "ul",
        { className: "pagination" },
        React.createElement(
          "li",
          { className: pager.currentPage === 1 ? "disabled" : "" },
          React.createElement(
            "a",
            { onClick: function onClick() {
                return _this2.setPage(1);
              } },
            "First"
          )
        ),
        React.createElement(
          "li",
          { className: pager.currentPage === 1 ? "disabled" : "" },
          React.createElement(
            "a",
            { onClick: function onClick() {
                return _this2.setPage(pager.currentPage - 1);
              } },
            "Previous"
          )
        ),
        pager.pages.map(function (page, index) {
          return React.createElement(
            "li",
            {
              key: index,
              className: pager.currentPage === page ? "active" : ""
            },
            React.createElement(
              "a",
              { onClick: function onClick() {
                  return _this2.setPage(page);
                } },
              page
            )
          );
        }),
        React.createElement(
          "li",
          {
            className: pager.currentPage === pager.totalPages ? "disabled" : ""
          },
          React.createElement(
            "a",
            { onClick: function onClick() {
                return _this2.setPage(pager.currentPage + 1);
              } },
            "Next"
          )
        ),
        React.createElement(
          "li",
          {
            className: pager.currentPage === pager.totalPages ? "disabled" : ""
          },
          React.createElement(
            "a",
            { onClick: function onClick() {
                return _this2.setPage(pager.totalPages);
              } },
            "Last"
          )
        )
      );
    }
  }]);

  return Pagination;
}(React.Component);

var App = function (_React$Component2) {
  _inherits(App, _React$Component2);

  function App() {
    _classCallCheck(this, App);

    var _this3 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this3.state = {
      exampleItems: [],
      pageOfItems: [],
      pager: {}
    };

    // bind function in constructor instead of render (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)
    _this3.onChangePage = _this3.onChangePage.bind(_this3);
    _this3.getPager = _this3.getPager.bind(_this3);
    return _this3;
  }

  _createClass(App, [{
    key: "onChangePage",
    value: function onChangePage(pageOfItems) {
      // update state with new page of items
      this.setState({ pageOfItems: pageOfItems });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this4 = this;

      fetch("https://jsonplaceholder.typicode.com/comments").then(function (res) {
        return res.json();
      }).then(function (json) {
        return _this4.setState({ exampleItems: json });
      });
    }
  }, {
    key: "getPager",
    value: function getPager(totalItems) {
      var currentPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

      // calculate total pages
      var totalPages = Math.ceil(totalItems / pageSize);

      var startPage, endPage;
      if (totalPages <= 10) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
      } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
          startPage = 1;
          endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
          startPage = totalPages - 9;
          endPage = totalPages;
        } else {
          startPage = currentPage - 5;
          endPage = currentPage + 4;
        }
      }

      // calculate start and end item indexes
      var startIndex = (currentPage - 1) * pageSize;
      var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

      // create an array of pages to ng-repeat in the pager control
      var pages = [].concat(_toConsumableArray(Array(endPage + 1 - startPage).keys())).map(function (i) {
        return startPage + i;
      });

      // return object with all pager properties required by the view
      var newPager = {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
      };

      this.setState({ pager: newPager });
      return newPager;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "div",
            { className: "text-center" },
            React.createElement(
              "h1",
              null,
              "Integrating Partial React with Django"
            ),
            React.createElement(Pagination, {
              items: this.state.exampleItems,
              onChangePage: this.onChangePage,
              getPager: this.getPager,
              pager: this.state.pager
            }),
            React.createElement(
              "div",
              { className: "table-responsive" },
              React.createElement(
                "table",
                { className: "table table-sm table-striped d-table sorted text-left" },
                React.createElement(
                  "thead",
                  null,
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "th",
                      null,
                      "Device #"
                    ),
                    React.createElement(
                      "th",
                      null,
                      "Bin"
                    ),
                    React.createElement(
                      "th",
                      null,
                      "Product"
                    ),
                    React.createElement(
                      "th",
                      null,
                      "Condition"
                    ),
                    React.createElement(
                      "th",
                      null,
                      "Accepted"
                    ),
                    React.createElement(
                      "th",
                      null,
                      "Hold Expiry"
                    ),
                    React.createElement(
                      "th",
                      null,
                      "Channel"
                    )
                  )
                ),
                React.createElement(
                  "tbody",
                  null,
                  this.state.pageOfItems.map(function (item) {
                    return React.createElement(
                      "tr",
                      { key: item.id },
                      React.createElement(
                        "td",
                        null,
                        "Link"
                      ),
                      React.createElement(
                        "td",
                        null,
                        item.id
                      ),
                      React.createElement(
                        "td",
                        null,
                        item.name
                      ),
                      React.createElement(
                        "td",
                        null,
                        item.email
                      ),
                      React.createElement(
                        "td",
                        null,
                        "lorem"
                      ),
                      React.createElement(
                        "td",
                        null,
                        "lorem"
                      ),
                      React.createElement(
                        "td",
                        null,
                        "lorem"
                      )
                    );
                  })
                )
              )
            ),
            React.createElement(Pagination, {
              items: this.state.exampleItems,
              onChangePage: this.onChangePage,
              getPager: this.getPager,
              pager: this.state.pager
            })
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);

var domContainer = document.querySelector("#root");
ReactDOM.render(React.createElement(App, null), domContainer);