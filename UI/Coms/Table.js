import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text
} from 'react-native'
import { DP, PX} from '../Lib/ScreenUtil';
const DEFAULT_HEIGHT = DP(240);
const DEFAULT_COLUMN_WIDTH = DP( 60);
import {fontSizeNormal} from './commondef';

class Table extends Component {

  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      width: PropTypes.number
    })).isRequired,
    columnWidth: PropTypes.number,
    height: PropTypes.number,
    dataSource: React.PropTypes.array.isRequired,
    renderCell: React.PropTypes.func,
  };

  static defaultProps = {
    columns: [],
    dataSource: [],
    columnWidth: DEFAULT_COLUMN_WIDTH,
    height: DEFAULT_HEIGHT,
    renderCell: undefined
  };

  _renderCell(cellData, col) {
    let style = {width: col.width || this.props.columnWidth || DEFAULT_COLUMN_WIDTH};
    return (
      <View key={col.dataIndex} style={[styles.cell, style]}>
        <Text style = {{fontSize: fontSizeNormal}}>{cellData}</Text>
      </View>
    )
  }

  _renderHeader() {
    let { columns, columnWidth } = this.props;
    return columns.map((col, index) => {
      let style = {width: col.width || columnWidth || DEFAULT_COLUMN_WIDTH};
      return (
        <View key={index} style={[styles.headerItem, style]}>
         <Text style = {{fontSize: fontSizeNormal, fontWeight: 'bold'}}>{col.title}</Text>
        </View>
      )
    })
  }

  _renderRow(rowData, index) {
    let { columns, renderCell } = this.props;
    if(!renderCell) {
      renderCell = this._renderCell.bind(this, );
    }
    return (
      <View key={index} style={styles.row}>
        {
          columns.map(col => renderCell(rowData[col.dataIndex], col))
        }
      </View>
    );
  }

  render() {
    let { dataSource, height } = this.props;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer , { height }]}
        horizontal={true}
        bounces={false} >
        <View>
          <ScrollView
            style={styles.dataView}
            contentContainerStyle={styles.dataViewContent} >
            { dataSource.map((rowData, index) => this._renderRow(rowData, index)) }
          </ScrollView>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  contentContainer: {
    height: DP(240)
  },
  header: {
    flexDirection: 'row',
  },
  headerItem: {
    minHeight: DP(30),
    width: DEFAULT_COLUMN_WIDTH,
    backgroundColor: 'white',
    borderRightWidth: DP(1),
    borderBottomWidth:DP(1),
    borderBottomColor: '#D2D2D2',
    borderRightColor: '#D2D2D2',

    alignItems: 'center',
    justifyContent: 'center'
  },
  dataView: {
    flexGrow: 1,
  },
  dataViewContent: {
  },
  row: {
    flexDirection: 'row',
    //backgroundColor: 'white',
    borderBottomWidth: DP(1),
    borderBottomColor: '#D2D2D2',
    borderLeftWidth: DP(1),
    borderLeftColor: '#D2D2D2',
  },
  cell: {
    minHeight: DP(40),
    width: DEFAULT_COLUMN_WIDTH,
    backgroundColor: 'transparent',
    borderRightWidth: DP(1),
    paddingLeft: DP(8),
    borderRightColor: '#D2D2D2',
    alignItems: 'flex-start',
    justifyContent: 'center'
  }
});

export default Table;

