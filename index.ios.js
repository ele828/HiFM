/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Image,
  ScrollView,
  InteractionManager,
  TouchableHighlight
} = React;

var audio = require('react-native').NativeModules.RNAudioPlayerURL;
var { Icon, } = require('react-native-icons');
var { BlurView, VibrancyView } = require('react-native-blur');

var hifm = React.createClass({
  getInitialState: function() {
      return {
        rotateValue: new Animated.Value(0),
        url:"",
        picture: "http://img3.douban.com/lpic/s2414855.jpg",
        channels: []
      }
  },

  componentDidMount: function() {
      this.getChannelList();
      this.getAudioInfo()
              .then(()=>{
                  console.log(this.state.url);
                  setInterval(()=>{
                      this.animating();
                  }, 3000);
                  this.animating();
                  audio.initWithURL(this.state.url);
                  audio.play();
              });
  },

  animating: function() {
    this.state.rotateValue.setValue(0);
    var handle = InteractionManager.createInteractionHandle();
    Animated.timing(this.state.rotateValue, {
      toValue: 360,
      duration: 3000,
      easing: Easing.linear
    }).start(()=>{
      InteractionManager.clearInteractionHandle(handle);
    }.bind(this));
  },

  getAudioInfo: function() {
    let musicUrl = "http://douban.fm/j/mine/playlist?channel=6";
    return fetch(musicUrl)
        .then((res) => res.json())
        .then((res) => {
            console.log(res.song[0].picture,res.song[0].url);
            this.setState({
                picture: res.song[0].picture,
                url: res.song[0].url
            });
        });

  },

  getChannelList: function() {
      let listUrl = "http://www.douban.com/j/app/radio/channels";
      return fetch(listUrl)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({
                        channels: res.channels
                    });
                });
  },

  _nextSong: function() {
      console.log(134)
      audio.pause();
      this.getAudioInfo()
            .then(() => {
                audio.setUrl(this.state.url);
                audio.play();
            })
  },

  render: function() {
     let channelsView = this.state.channels.map((c) => {
         return (<View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1
                }}>
                    <Text style={{color:"#000"}}>{c.name}   {c.channal_id}</Text>
                </View>);
     });

    return (
      <View style={styles.container}>
          <Image source={{uri: this.state.picture}} style={[styles.container, {opacity: 1}]}>
            <VibrancyView blurType="light" style={styles.container}></VibrancyView>
          </Image>
          <View style={{
              shadowColor: "#000",
              shadowOffset: {width: 10, height: 10},
              shadowOpacity: 10,
              shadowRadius: 30,
           }}>
              <Animated.Image
                ref={component => this._album = component}
                source={{uri: this.state.picture}}
                style={{
                  flex: 1,
                  marginTop: -580,
                  marginLeft: 80,
                  width: 200,
                  height: 200,
                  position: "absolute",
                  borderRadius: 100,
                  borderWidth: 30,
                  borderColor: "#000",
                  transform: [
                    {rotate: this.state.rotateValue.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg']
                    })
                    }
                  ]
                }}>
              </Animated.Image>

            <View style={{
                position: "absolute",
                marginTop: -340,
                shadowColor: "#000",
                shadowOffset: {width: 10, height: 10},
                shadowOpacity: 10,
                shadowRadius: 30,
            }}>
                <Icon
                    name='fontawesome|step-backward'
                    size={40}
                    color='#fff'
                    style={{
                        position: "absolute",
                        marginLeft: 75,
                        width: 40,
                        height: 40,
                    }}
                />
                <Icon
                    name='fontawesome|pause'
                    size={40}
                    color='#fff'
                    style={{
                        position: 'absolute',
                        marginLeft: 165,
                        width: 40,
                        height: 40,
                    }}
                />
                <TouchableHighlight underlayColor="transparent" onPress={this._nextSong}>
                    <Icon
                        name='fontawesome|step-forward'
                        size={40}
                        color='#fff'
                        style={{
                            position: "absolute",
                            marginLeft: 245,
                            width: 40,
                            height: 40,
                        }}
                    />
                </TouchableHighlight>
            </View>
            <ScrollView style={{
                position: "absolute",
                marginTop: -250,
                backgroundColor: "#fff",
                width: 378,
                height: 259,
                opacity: 0.4
            }}>
                {
                    channelsView
                }
            </ScrollView>
          </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('hifm', () => hifm);
