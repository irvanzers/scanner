import React, { useCallback, useState, useEffect }  from 'react'
import { Button, View, StyleSheet, FlatList, InteractionManager, Alert } from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker';
import Loading from './../../components/Loading';
import Text from './../../components/Text';
import { Card, Title, Colors, Appbar, Menu } from 'react-native-paper';
import Moment from 'moment';
import List from './../../components/MenuList/List';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _, { reduce } from 'lodash';
import * as apiAction from './../../redux/actions/apiAction';
import * as crudAction from '../../redux/actions/crudAction';
import * as flashMessage from '../../redux/actions/flashMessage';
import * as authService from './../../redux/services/authService';
import Common from './../../redux/constants/common';
import { theme } from '../../redux/constants/theme';
import {getUuid, setUuid} from './../../redux/utils/actionUtil';

const CollectionList = ( props ) => {
  const { collectiondata, collectionlistdetail }=props; 
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handlePress = () => setExpanded(!expanded);
  
  const loadData = async() => {  
    try {
        const datasubmit = {
            header_id: props.route.params.data
        }
        // await props.actions.fetchAll(Common.COLLECTION_DATA);    
        await props.actions.fetchAll(Common.COLLECTION_LIST_DETAIL, datasubmit);
        setIsLoading(false);  
    } catch (error) {
        alert(error)
    } finally {
        setIsLoading(false);        
    }
}

const onSubmit = () => {
    Alert.alert(
        "PERHATIAN",
        "JIKA ADA JOB YANG BELUM DI VISIT/SUBMIT, MAKA STATUSNYA TIDAK TERTAGIH!",
        [{
            text: "BATAL",
            onPress: () => console.log("No, continue editing")
        }, {
            text: "YA",
            onPress: () => {
                console.log('Yes')
            },
            style: "cancel"
        }],
    );
}

const toggleBottomNavigationView = () => {
    setVisible(!visible);
};

const handlePresentModalPress = useCallback((item) => {
    bottomSheetModalRef.current?.present();
}, []);

const handleSheetChanges = useCallback((index: number) => {
    console.log(index)
}, []);

useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
        loadData()
    });
    return () => interactionPromise.cancel();
},[])

const keyExtractor = useCallback((item, index) => index.toString(), []);
const listcollection = collectionlistdetail ? collectionlistdetail.assigned_data : [];
const assignedarcount = collectionlistdetail ? collectionlistdetail.assigned_ar_count : [];
const assignedcount = collectionlistdetail ? collectionlistdetail.assigned_count : [];
const statusheader = collectionlistdetail ? collectionlistdetail.header_status : [];
const tunailist = collectionlistdetail ? collectionlistdetail.tunai_list : [];
const transferlist = collectionlistdetail ? collectionlistdetail.transfer_list : [];
// console.log(tunailist);

    const renderTopItem = ({}) => {
        return(
            <View style={{flex:1}}>
            <View flexDirection="row" style={{height: 40, justifyContent: 'space-between', paddingLeft: 10,  backgroundColor: 'white'}}>
                <View flexDirection="row" style={{ justifyContent: 'space-between' }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`ID HEADER : ${statusheader.id}`} p style={{ textTransform: 'uppercase', color: 'grey' }} bold />
                    </View>
                </View>
            </View>
            <View flexDirection="row" style={{height: 40, justifyContent: 'space-between',  paddingLeft: 10,  backgroundColor: 'white'}}>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TANGGAL : ${statusheader.header_date}`} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                </View>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TOTAL OUTLET: `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginRight: 10}}>
                        <Text title={assignedcount} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                    </View>
                </View>
            </View>
            <View flexDirection="row" style={{height: 40, justifyContent: 'space-between', paddingBottom: 10, paddingLeft: 10,  backgroundColor: 'white'}}>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`STATUS : ${statusheader?.status}`} p style={{ textTransform: 'uppercase', color: `${statusheader ? statusheader.color : '#B4B4B4'}` }} />
                    </View>
                </View>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TOTAL TAGIHAN(AR): `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginRight: 10}}>
                        <Text title={assignedarcount} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                    </View>
                </View>
            </View>
            <View flexDirection="row" style={{height: 40, justifyContent: 'space-between',paddingBottom: 15,  paddingLeft: 10,  backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: .5}}>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TOTAL TRANSFER : `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginRight: 10}}>
                        <Text title={transferlist} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                    </View>
                </View>
                <View flexDirection="row" style={{ justifyContent: 'space-between',  }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text title={`TOTAL TUNAI: `} p style={{ textTransform: 'uppercase', color: 'grey' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginRight: 10}}>
                        <Text title={tunailist} p style={{color: 'grey', textTransform: 'uppercase'}}/>
                    </View>
                </View>
            </View>
            {/* { collectiondraft.id == '' &&
                <View style={{alignItems: 'center', marginTop: 10}}>
                    <Text title={'DATA TAGIHAN TIDAK DITEMUKAN'} p style={{color: 'grey'}} />
                </View>
            } */}   
        </View>
        )
    }

    const renderCategory = ({item, index}) => {
        return (
            <>
                { item.job_status <= 1 ?
                    <View flexDirection="row" style={{marginVertical: 5}}>                
                        <View style={[styles.viewLine, { paddingTop: 0 }]} />
                        <View style={styles.divider} />
                        <List
                            nav="CollectionDetail"  
                            item={item}
                            iconList="briefcase-check"
                            color={'green'}
                            title={item.cust_name}
                            sizeIcon={30}
                        />
                    </View>
                    : (
                    <View flexDirection="row" style={{marginVertical: 5}}>                
                        <View style={[styles.viewLine, { paddingTop: 0 }]} />
                        <View style={styles.divider} />
                        <List
                            style={{backgroundColor: '#C8C8C8'}}
                            nav="CollectionDetail"
                            item={item}
                            iconList={"briefcase-check"}
                            color={'grey'}
                            title={item.cust_name}
                            sizeIcon={30}
                        />
                    </View>
                    )}
            </>
        )
    }

  return (
    <View>      
      <Appbar.Header>
          <Appbar.BackAction onPress={() => props.navigation.goBack()} />
          <Appbar.Content title={'LIST TAGIHAN'} />
          <Appbar.Action
                icon={'barcode-scan'} 
                onPress={() => props.navigation.navigate('ScannerScreen')}
          />
          <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={<Appbar.Action color="white" icon={'dots-vertical'} onPress={() => openMenu()} />}>
              <Menu.Item onPress={handlePresentModalPress} title="TRANSFER SALDO" />
              <Menu.Item onPress={() => { onSubmit('submit') }} title="SUBMIT JOB" />
          </Menu>
      </Appbar.Header>     
      
      <View style={{flex: 1, padding: 20}}>
      <BottomSheetModal
            ref={bottomSheetModalRef}
            initialSnapIndex={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
        >
            <View style={styles.bottomNavigationView}>
                <Text title="TRANSFER SALDO KE YASA" h6 bold />
                <View style={{ marginTop: 10 }}>
                    <Controller
                        defaultValue={`${profile.user.user_saldo}`}
                        name="saldo"
                        control={control}
                        rules={{ required: { value: true, message: 'Nilai uang tunai harus diisi' } }}
                        render={({ onChange, value }) => (
                            <Input
                                error={errors.saldo}
                                errorText={errors?.saldo?.message}
                                onChangeText={(text) => {
                                    onChange(text)
                                }}
                                style={{ fontSize: 24 }}
                                value={value}
                                keyboardType={'numeric'}
                                placeholder=""
                            />
                        )}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 }}>
                    
                </View>
                <Button mode="contained" disabled={loading} contentStyle={{ height: 50 }} style={{ width: '100%' }} onPress={handleSubmit(onSubmit)}>
                    Konfirmasi
                </Button>
            </View>
      </BottomSheetModal>
      </View>
      <Loading loading={isLoading} /> 
    
        <FlatList style={styles.list}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            initialNumToRender={3}
            data={listcollection}
            ListHeaderComponent={renderTopItem}
            keyExtractor={keyExtractor}
            renderItem={renderCategory}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  buttonCart: {
      display: 'flex', 
      alignSelf: 'center',
      width: '100%'
  },
  textOri: {
      height: '90%', 
      paddingTop: 30,
      backgroundColor: '#ffff', 
      display: 'flex', 
      // justifyContent: 'center', 
      paddingLeft: 20,
      fontSize: 14,
      fontWeight: 'bold',
  },
  textCamera: {
      height: '90%', 
      backgroundColor: 'black', 
      // display: 'flex', 
      justifyContent: 'center', 
      paddingLeft: 10,
      fontSize: 14,
      fontWeight: 'bold',
  },
  viewBox: {
      marginTop: 10, 
      backgroundColor: '#ffff', 
      padding: 10
  }
})


function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        apiState: state.api,
        message: state.flash.message,
        collectiondata: state.crud.collectiondatas,
        collectionlistdetail: state.crud.collectionlistdetails,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(_.assign({}, authService, crudAction, apiAction, flashMessage), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionList)