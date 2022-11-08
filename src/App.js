import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [],
      userId: null,
      isLoading: true,
      limit: 30,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.handleReadMore = this.handleReadMore.bind(this);
  }
  componentDidMount() {
    //this.setState({ isLoading: true });
    fetch("https://dummyjson.com/posts")
      .then((res) => res.json())
      .then((res) => {
        this.setState({ item: res, isLoading: false });
      });
    // this.setState({isLoading : false})
    window.addEventListener("scroll", this.handleScroll, true);
  }
  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate method is called");
    if (this.props.limit !== prevProps.limit) {
      this.handleScroll();
    }
  }
  handleReadMore = () => {
    let newLimit = this.state.limit + 2;
    if (newLimit > 150) {
      console.log("NO more items");
    } else {
      try {
        fetch(`https://dummyjson.com/posts?limit=${newLimit}`)
          .then((res) => res.json())
          .then((res) => {
            this.setState({ item: res, isLoading: false });
          });
      } catch (error) {
        console.log("failed to load more", error);
      }
    }
  };
  handleScroll(e) {
    let newSet = this.state.limit + 15;
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight &&
      !this.state.isLoading &&
      newSet < 150
    ) {
      console.log("### the end ###");
      fetch(`https://dummyjson.com/posts?limit=${newSet}`)
        .then((res) => res.json())
        .then((res) => {
          this.setState({ item: res, isLoading: false });
        });
      newSet = newSet + 15;
      this.state.limit = this.state.limit + 15;
    }
  }
  render() {
    const { item, isLoading } = this.state;
    console.log("items ===>>", item.tags);
    return (
      <React.Fragment>
        {!isLoading ? (
          <React.Fragment>
            <ul className="reaction" onScroll={this.handleScroll}>
              {item &&
                item.posts &&
                item.posts.map((items, index) => (
                  <tr>
                    <div className="post" id={index}>
                      <small>USER-ID:{items.id}</small>
                      <h1>{items.title}</h1> {items.body}
                    </div>
                    <span>{items.tags.join(" ")}</span>
                    <span>---------------------------------------------</span>
                  </tr>
                ))}
            </ul>
            <button className="read-more" onClick={this.handleReadMore}>
              LOAD MORE
            </button>
          </React.Fragment>
        ) : (
          <h1>Loading comments...</h1>
        )}
      </React.Fragment>
    );
  }
}

export default App;
