/**
 * Created by schandrashekar on 9/4/17.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  ListView,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import {
  SearchBar
} from 'react-native-elements';

class CustomListItem extends React.PureComponent {
  render() {
    const { name, symbol, price_usd } = this.props.item;
    return (
      <View>
        <View style={styles.rowContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>{symbol}</Text>
          </View>
          <Text style={styles.price}>${price_usd}</Text>
        </View>
        <View style={styles.separator}/>
      </View>
    );
  }
}

class CryptoList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
      page: 1,
      refreshing: false,
      searching: false
    };
  }

  componentDidMount() {
    this._fetchCryptoList();
  }

  _handleResponse = (res, error) => {
    this.setState({
      loading: false,
      data: res,
      error: error|| res.error || null,
      refreshing: false
    });
  };

  _fetchCryptoList = () => {
    const API = {
      limit: 10,
      url: 'https://api.coinmarketcap.com/v1/ticker/?limit='
    };

    const total = API.limit * this.state.page;
    this.setState({
      loading: true
    });
    const url = API.url+`${total}`;
    fetch(url)
    .then(res => res.json())
    .then(res => {
        this._handleResponse(res);
      })
    .catch(error => {
        this._handleResponse(null, error);
      });
  };

  _fetchMoreCryptoList = () => {
    if (this.state.searching) return;

    this.setState({
      page: this.state.page + 1
    }, () => {
      this._fetchCryptoList();
    });
  };

  _keyExtractor = (item, index) => index;

  _renderItemComponent = ({item}) => {
    return (
      <CustomListItem
        item={item} />
    );
  };

  _renderItemSeparator = () => {
    return (
      <View style={styles.itemSeparator} />
    );
  };

  _renderListHeader = () => {
    return (
      <SearchBar
        placeholder='Search'
        darkTheme
        onChangeText={this._onSearchInputChanged}
      />
    );
  };

  _onSearchInputChanged = (text) => {
    if (!this.state.data) {
      return null;
    }
    if (text.length < 1) {
      this._setSearchingState(false);
      return this._fetchCryptoList();
    }

    this._setSearchingState(true);
    this._filterCrypotListWithSearchString(text)
    .then(res => {
        this.setState({
          data: res
        });
      });
  };

  _setSearchingState = (searching) => {
    this.setState({
      searching
    });

  };

  _filterCrypotListWithSearchString = (str) => {
    return new Promise((resolve, reject) => {
      const cryptoList = this.state.data;
      let result = cryptoList.filter(crypto => {
        const name = crypto.name.toLowerCase();
        const symbol = crypto.symbol.toLowerCase();
        return name.indexOf(str.toLowerCase()) > -1 || symbol.indexOf(str.toLowerCase()) > -1;
      });
      resolve(result);
    });
  };

  _renderListFooter = () => {
    if (!this.state.loading) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator animating size='large' />
      </View>
    );
  };

  _refreshList = () => {
    if (this.state.searching) return;

    this.setState({
      page: 1,
      refreshing: true
    } , () => {
      this._fetchCryptoList();
    });
  };

  render() {
    return (
    <FlatList
      data={this.state.data}
      renderItem={this._renderItemComponent}
      keyExtractor={this._keyExtractor}
      containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}
      ItemSeparatorComponent={this._renderItemSeparator}
      ListHeaderComponent={this._renderListHeader}
      ListFooterComponent={this._renderListFooter}
      refreshing={this.state.refreshing}
      onRefresh={this._refreshList}
      onEndReached={this._fetchMoreCryptoList}
      onEndThreshold={0}
      />
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#8BC34A'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#512DA8'
  },
  itemSeparator: {
    height: 1,
    width: '90%',
    backgroundColor: '#CED0CE',
    alignSelf: 'center'
  },
  footer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#CED0CE'
  }
});

export default CryptoList;