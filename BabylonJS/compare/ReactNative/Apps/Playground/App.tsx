/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, FunctionComponent, useEffect, useCallback } from 'react';
import { SafeAreaView, StatusBar, Button, View, Text, ViewProps, Image } from 'react-native';

import { EngineView, useEngine, EngineViewCallbacks } from '@babylonjs/react-native';
import { Scene, Vector3, FreeCamera, Camera, HemisphericLight, WebXRSessionManager, MeshBuilder, TransformNode, DeviceSourceManager, DeviceType, DeviceSource, PointerInput, WebXRTrackingState, Nullable } from '@babylonjs/core';
import '@babylonjs/loaders';
import Slider from '@react-native-community/slider';

const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const defaultScale = 1;
  const enableSnapshots = false;

  const engine = useEngine();
  const [toggleView, setToggleView] = useState(false);
  const [camera, setCamera] = useState<Camera>();
  const [rootNode, setRootNode] = useState<TransformNode>();
  const [scene, setScene] = useState<Scene>();
  const [xrSession, setXrSession] = useState<WebXRSessionManager>();
  const [scale, setScale] = useState<number>(defaultScale);
  const [snapshotData, setSnapshotData] = useState<string>();
  const [engineViewCallbacks, setEngineViewCallbacks] = useState<EngineViewCallbacks>();
  const [trackingState, setTrackingState] = useState<WebXRTrackingState>();

  useEffect(() => {
    if (engine) {
      const scene = new Scene(engine);
      setScene(scene);
      var camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
      // Target the camera to scene origin
      camera.setTarget(Vector3.Zero());
      setCamera(scene.activeCamera!);
      new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
      const rootNode = new TransformNode("Root Container", scene);
      setRootNode(rootNode);

      const deviceSourceManager = new DeviceSourceManager(engine);
      const handlePointerInput = (inputIndex: PointerInput, previousState: Nullable<number>, currentState: Nullable<number>) => {
        if (inputIndex === PointerInput.Horizontal &&
          currentState && previousState) {
          rootNode.rotate(Vector3.Down(), (currentState - previousState) * 0.005);
        };
      };

      deviceSourceManager.onDeviceConnectedObservable.add(device => {
        if (device.deviceType === DeviceType.Touch) {
          const touch: DeviceSource<DeviceType.Touch> = deviceSourceManager.getDeviceSource(device.deviceType, device.deviceSlot)!;
          touch.onInputChangedObservable.add(touchEvent => {
            handlePointerInput(touchEvent.inputIndex, touchEvent.previousState, touchEvent.currentState);
          });
        } else if (device.deviceType === DeviceType.Mouse) {
          const mouse: DeviceSource<DeviceType.Mouse> = deviceSourceManager.getDeviceSource(device.deviceType, device.deviceSlot)!;
          mouse.onInputChangedObservable.add(mouseEvent => {
            if (mouse.getInput(PointerInput.LeftClick)) {
              handlePointerInput(mouseEvent.inputIndex, mouseEvent.previousState, mouseEvent.currentState);
            }
          });
        }
      });

      const transformContainer = new TransformNode("Transform Container", scene);
      transformContainer.parent = rootNode;
      transformContainer.scaling.scaleInPlace(0.3);

      scene.beforeRender = function () {
        transformContainer.rotate(Vector3.Up(), 0.005 * scene.getAnimationRatio());
        const list = transformContainer.getChildren();
        list.forEach(function (node) {
          node.rotate(Vector3.Left(), 0.005 * scene.getAnimationRatio());
        })
      };

      const count = 20;
      for (let i = -count; i < count; i++) {
        for (let j = -count; j < count; j++) {
          // for (let k = -count; k < count; k++) {
          let sphere = MeshBuilder.CreateTiledBox('CreateTiledBox', {}, scene);
          sphere.position = new Vector3(i * 1.1, j * 1.1, 0);
          sphere.parent = transformContainer;
          // }
        }
      }
    }
  }, [engine]);

  useEffect(() => {
    if (rootNode) {
      rootNode.scaling = new Vector3(scale, scale, scale);
    }
  }, [rootNode, scale]);

  const trackingStateToString = (trackingState: WebXRTrackingState | undefined) : string => {
    return trackingState === undefined ? "" : WebXRTrackingState[trackingState];
  };

  const onToggleXr = useCallback(() => {
    (async () => {
      if (xrSession) {
        await xrSession.exitXRAsync();
        setXrSession(undefined);
        setTrackingState(undefined);
      } else {
        if (rootNode !== undefined && scene !== undefined) {
          const xr = await scene.createDefaultXRExperienceAsync({ disableDefaultUI: true, disableTeleportation: true })
          const session = await xr.baseExperience.enterXRAsync("immersive-ar", "unbounded", xr.renderTarget);
          setXrSession(session);

          setTrackingState(xr.baseExperience.camera.trackingState);
          xr.baseExperience.camera.onTrackingStateChanged.add((newTrackingState) => {
            setTrackingState(newTrackingState);
          });

          // TODO: Figure out why getFrontPosition stopped working
          //box.position = (scene.activeCamera as TargetCamera).getFrontPosition(2);
          const cameraRay = scene.activeCamera!.getForwardRay(1);
          rootNode.position = cameraRay.origin.add(cameraRay.direction.scale(cameraRay.length));
          rootNode.rotate(Vector3.Up(), 3.14159);
        }
      }
    })();
  }, [rootNode, scene, xrSession]);

  const onInitialized = useCallback(async(engineViewCallbacks: EngineViewCallbacks) => {
    setEngineViewCallbacks(engineViewCallbacks);
  }, [engine]);

  const onSnapshot = useCallback(async () => {
    if (engineViewCallbacks) {
      setSnapshotData("data:image/jpeg;base64," + await engineViewCallbacks.takeSnapshot());
    }
  }, [engineViewCallbacks]);

  return (
    <>
      <View style={props.style}>
        <Button title="Toggle EngineView" onPress={() => { setToggleView(!toggleView) }} />
        <Button title={ xrSession ? "Stop XR" : "Start XR"} onPress={onToggleXr} />
        { !toggleView &&
          <View style={{flex: 1}}>
            { enableSnapshots &&
              <View style ={{flex: 1}}>
                <Button title={"Take Snapshot"} onPress={onSnapshot}/>
                <Image style={{flex: 1}} source={{uri: snapshotData }} />
              </View>
            }
            <EngineView style={props.style} camera={camera} onInitialized={onInitialized} />
            <Slider style={{position: 'absolute', minHeight: 50, margin: 10, left: 0, right: 0, bottom: 0}} minimumValue={0.2} maximumValue={2} step={0.01} value={defaultScale} onValueChange={setScale} />
            <Text style={{fontSize: 12, color: 'yellow',  position: 'absolute', margin: 10}}>{trackingStateToString(trackingState)}</Text>
          </View>
        }
        { toggleView &&
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 24}}>EngineView has been removed.</Text>
            <Text style={{fontSize: 12}}>Render loop stopped, but engine is still alive.</Text>
          </View>
        }
      </View>
    </>
  );
};

const App = () => {
  const [toggleScreen, setToggleScreen] = useState(false);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
        { !toggleScreen &&
          <EngineScreen style={{flex: 1}} />
        }
        { toggleScreen &&
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 24}}>EngineScreen has been removed.</Text>
            <Text style={{fontSize: 12}}>Engine has been disposed, and will be recreated.</Text>
          </View>
        }
        <Button title="Toggle EngineScreen" onPress={() => { setToggleScreen(!toggleScreen) }} />
      </SafeAreaView>
    </>
  );
};

export default App;
