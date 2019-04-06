class Pagination extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      this.setPage(this.props.initialPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // reset page if items array has changed
    if (this.props.items !== prevProps.items) {
      this.setPage(this.props.initialPage);
    }
  }

  setPage(page) {
    var { items, pageSize, pager } = this.props;

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

  render() {
    var pager = this.props.pager;

    if (!pager.pages || pager.pages.length <= 1) {
      // don't display pager if there is only 1 page
      return null;
    }

    return (
      <ul className="pagination">
        <li className={pager.currentPage === 1 ? "disabled" : ""}>
          <a onClick={() => this.setPage(1)}>First</a>
        </li>
        <li className={pager.currentPage === 1 ? "disabled" : ""}>
          <a onClick={() => this.setPage(pager.currentPage - 1)}>Previous</a>
        </li>
        {pager.pages.map((page, index) => (
          <li
            key={index}
            className={pager.currentPage === page ? "active" : ""}
          >
            <a onClick={() => this.setPage(page)}>{page}</a>
          </li>
        ))}
        <li
          className={pager.currentPage === pager.totalPages ? "disabled" : ""}
        >
          <a onClick={() => this.setPage(pager.currentPage + 1)}>Next</a>
        </li>
        <li
          className={pager.currentPage === pager.totalPages ? "disabled" : ""}
        >
          <a onClick={() => this.setPage(pager.totalPages)}>Last</a>
        </li>
      </ul>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      exampleItems: [],
      pageOfItems: [],
      pager: {}
    };

    // bind function in constructor instead of render (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)
    this.onChangePage = this.onChangePage.bind(this);
    this.getPager = this.getPager.bind(this);
  }

  onChangePage(pageOfItems) {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  }

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/comments")
      .then(res => res.json())
      .then(json => this.setState({ exampleItems: json }));
  }

  getPager(totalItems, currentPage = 1, pageSize = 10) {
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
    var pages = [...Array(endPage + 1 - startPage).keys()].map(
      i => startPage + i
    );

    // return object with all pager properties required by the view
    const newPager = {
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

  render() {
    return (
      <div>
        <div className="container">
          <div className="text-center">
            <h1>Integrating Partial React with Django</h1>
            <Pagination
              items={this.state.exampleItems}
              onChangePage={this.onChangePage}
              getPager={this.getPager}
              pager={this.state.pager}
            />
            <div className="table-responsive">
              <table className="table table-sm table-striped d-table sorted text-left">
                <thead>
                  <tr>
                    <th>Device #</th>
                    <th>Bin</th>
                    <th>Product</th>
                    <th>Condition</th>
                    <th>Accepted</th>
                    <th>Hold Expiry</th>
                    <th>Channel</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.pageOfItems.map(item => (
                    <tr key={item.id}>
                      <td>Link</td>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>lorem</td>
                      <td>lorem</td>
                      <td>lorem</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              items={this.state.exampleItems}
              onChangePage={this.onChangePage}
              getPager={this.getPager}
              pager={this.state.pager}
            />
          </div>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#root");
ReactDOM.render(<App />, domContainer);
