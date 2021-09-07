<template>
  <div id="WebGL-output"></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import TrackballControls from "three-trackballcontrols";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const ThreeBSP = require("three-js-csg")(THREE);

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      sphere: null,
      controls: null,
      mixer: null,
      mixer1: null,
      mixer2: null,
      mixer3: null,
      mixer4: null,
      clock: null,
      rotationValues: [0, Math.PI / 2],
      group3D: null,
      step: 0
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log("using THREE.js version:" + THREE.REVISION);

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      let scene = new THREE.Scene();

      // create a camera, which defines where we're looking at.
      let camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      // create a render and set the size
      let renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(new THREE.Color(0x000000));
      renderer.setSize(window.innerWidth, window.innerHeight);
      // 启用阴影
      renderer.shadowMap.enabled = true;
      // show axes in the screen

      // let axes = new THREE.AxesHelper(30);
      // 将坐标轴添加到场景中
      // scene.add(axes);
      console.log(dat);
      scene.add(this.createPlane());
      // create a cube
      scene.add(this.createCube(6, 10, 0.1, 0, 3, 0, 0));

      const cube1 = this.createCube(2, 10, 0.1, 1, 0, 0, 1);
      const cube1LeftEars = this.createCube(2, 2, 0.1, -1, 0, -1, 1);
      const cube1RightEars = this.createCube(2, 2, 0.1, -1, 0, 1, 1);
      const cube2 = this.createCube(6, 10, 0.1, 3, 0, 0, 4);
      const cube3 = this.createCube(2, 10, 0.1, 1, 0, 0, 4);
      let group = this.creatGroup(3, 3, 0, "group", cube1);
      let groupLeftEars = this.creatGroup(
        2,
        0,
        -5,
        "groupLeftEars",
        cube1LeftEars
      );
      let groupRightEars = this.creatGroup(
        2,
        0,
        5,
        "groupRightEars",
        cube1RightEars
      );
      let groupTop = this.creatGroup(2, 0, 0, "groupTop", cube2);
      let groupTop1 = this.creatGroup(6, 0, 0, "groupTop1", cube3);

      let clip = this.creatClip(
        group,
        "group.rotation[z]",
        [0, 5],
        "close",
        10
      );
      let clipLeftEars = this.creatClip(
        groupLeftEars,
        "groupLeftEars.rotation[x]",
        [0, 2],
        "close",
        10
      );
      let clipRightEars = this.creatClip(
        groupRightEars,
        "groupRightEars.rotation[x]",
        [0, 2],
        "close",
        10,
        [0, -Math.PI / 2]
      );
      let clipTop = this.creatClip(
        groupTop,
        "groupTop.rotation[z]",
        [0, 5],
        "closeTop",
        10
      );
      let clipTop1 = this.creatClip(
        groupTop1,
        "groupTop1.rotation[z]",
        [0, 5],
        "closeTop1",
        10
      );

      group.add(groupTop);
      group.add(groupLeftEars);
      group.add(groupRightEars);
      groupTop.add(groupTop1);
      this.mixer = new THREE.AnimationMixer(group); // 动画混合器
      this.creatClipAction(clip, this.mixer);
      this.creatClipAction(clipLeftEars, this.mixer);
      this.creatClipAction(clipRightEars, this.mixer);
      this.creatClipAction(clipTop, this.mixer);
      this.creatClipAction(clipTop1, this.mixer);

      // 创建纸箱侧面(前)
      const sideCube = this.createCube(2, 10, 0.1, -1, 0, 0, 1);
      const sideCubeLeftEars = this.createCube(2, 2, 0.1, -1, 0, -1, 1);
      const sideCubeRightEars = this.createCube(2, 2, 0.1, -1, 0, 1, 1);
      const sideGroup = this.creatGroup(-3, 3, 0, "sideGroup", sideCube);
      const sideLeftEars = this.creatGroup(
        0,
        0,
        -5,
        "sideCubeLeftEars",
        sideCubeLeftEars
      );
      const sideRightEars = this.creatGroup(
        0,
        0,
        5,
        "sideCubeRightEars",
        sideCubeRightEars
      );
      let sideClip = this.creatClip(
        sideGroup,
        "sideGroup.rotation[z]",
        [5, 7],
        "sideClose",
        10,
        [0, -Math.PI / 2]
      );
      let sideClipLeftEars = this.creatClip(
        sideLeftEars,
        "sideCubeLeftEars.rotation[x]",
        [0, 2],
        "sideClose",
        10
      );
      let sideClipRightEars = this.creatClip(
        sideRightEars,
        "sideCubeRightEars.rotation[x]",
        [0, 2],
        "sideClose",
        10,
        [0, -Math.PI / 2]
      );
      sideGroup.add(sideLeftEars);
      sideGroup.add(sideRightEars);
      this.mixer1 = new THREE.AnimationMixer(sideGroup);

      this.creatClipAction(sideClip, this.mixer1);
      this.creatClipAction(sideClipLeftEars, this.mixer1);
      this.creatClipAction(sideClipRightEars, this.mixer1);

      // 创建纸箱侧面(左)
      const leftSideCube = this.createCube(6, 2, 0.1, 0, 0, -1, 1);
      const leftSideGroup = this.creatGroup(
        0,
        3,
        -5,
        "leftSideGroup",
        leftSideCube
      );
      console.log(leftSideGroup);
      let leftSideClip = this.creatClip(
        leftSideGroup,
        "leftSideGroup.rotation[x]",
        [5, 7],
        "leftSideClose",
        10
      );

      this.mixer2 = new THREE.AnimationMixer(leftSideGroup);
      console.log(this.mixer2);
      this.creatClipAction(leftSideClip, this.mixer2);

      // 创建纸箱侧面(右)
      const rightSideCube = this.createCube(6, 2, 0.1, 0, 0, 1, 1);
      const rightSideGroup = this.creatGroup(
        0,
        3,
        5,
        "rightSideGroup",
        rightSideCube
      );
      console.log(rightSideGroup);
      let rightSideClip = this.creatClip(
        rightSideGroup,
        "leftSideGroup.rotation[x]",
        [5, 7],
        "leftSideClose",
        10,
        [0, -Math.PI / 2]
      );

      this.mixer3 = new THREE.AnimationMixer(rightSideGroup);
      this.creatClipAction(rightSideClip, this.mixer3);

      // 将创建好的组添加到场景
      scene.add(group);
      scene.add(sideGroup);
      scene.add(leftSideGroup);
      scene.add(rightSideGroup);

      this.clock = new THREE.Clock();
      // position and point the camera to the center of the scene
      camera.position.x = -30;
      camera.position.y = 40;
      camera.position.z = 30;
      camera.lookAt(scene.position);

      let spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(-60, 140, 100);
      spotLight.castShadow = true;
      spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
      spotLight.shadow.camera.far = 130;
      spotLight.shadow.camera.near = 40;
      scene.add(spotLight);

      // 以下为测试模型：裁剪功能
      // threeBSP.js

      let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
      let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      // 为物体投射阴影
      sphere.castShadow = true;

      // position the sphere
      sphere.position.x = -17;
      sphere.position.y = 4;
      sphere.position.z = 2;

      //创建立方体几何体
      let cubeGeometry = new THREE.BoxGeometry(2, 12, 6);
      let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 }); //, wireframe: true
      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

      // 为物体投射阴影
      cube.castShadow = true;

      // position the cube
      cube.position.x = -17;
      cube.position.y = 3;
      cube.position.z = 2;

      // scene.add(sphere);
      // scene.add(cube);

      let sphereBSP = new ThreeBSP(sphere);
      let cubeBSP = new ThreeBSP(cube);

      // BSP提供三种计算方式分别为：
      // inetersect 并集计算
      // subtract 差集计算
      // union 合集计算

      // 当前模型使用差集计算
      let resultBSP = sphereBSP.subtract(cubeBSP);

      // 从BSP对象内获取到处理完后的mesh模型数据
      let result = resultBSP.toMesh();

      // 更新模型的面和顶点的数据
      result.geometry.computeFaceNormals();
      result.geometry.computeVertexNormals();

      //为新的几何体赋值一个纹理
      let material = new THREE.MeshLambertMaterial({ color: 0x499c54 });
      result.material = material;
      //let result1 = new THREE.Mesh(result, material);

      //将计算出来模型添加到场景当中
      scene.add(result);

      // 测试模型 ..... end

      // this.group3D = new THREE.Object3D();
      // let range = 200;
      // for (let i = 0; i < 400; i++) {
      //   this.group3D.add(this.createSprite(10, false, 0.6, 0xffffff, i % 5, range));
      // }
      // scene.add(this.group3D);

      let texture = new THREE.TextureLoader();
      let ylj = require("./Unknown.png");
      const bg = texture.load(ylj);
      let cubeGeometry1 = new THREE.BoxGeometry(2, 6, 6);
      let cubeMaterial1 = new THREE.MeshLambertMaterial({
        map: bg,
        color: 0xc79463
      }); //, wireframe: true
      let testCube = new THREE.Mesh(cubeGeometry1, cubeMaterial1);
      testCube.position.y = 15;
      cubeMaterial1.map.wrapS = THREE.RepeatWrapping;
      cubeMaterial1.map.offset = new THREE.Vector2(1, 0.6);
      cubeMaterial1.map.repeat = new THREE.Vector2(2, 1);
      cubeMaterial1.map.rotation = -0.5 * Math.PI;
      scene.add(testCube);

      // add the output of the renderer to the html element
      document.getElementById("WebGL-output").appendChild(renderer.domElement);

      this.controls = new TrackballControls(camera, renderer.domElement);
      this.controls.update();
      this.renderer = renderer;
      this.scene = scene;
      this.camera = camera;
      console.log(rightSideClip);

      const loader = new GLTFLoader();
      loader.load(
        "models/kunchong.glb",
        (gltf) => {
          gltf.scene.position.x = 0;
          gltf.scene.position.y = 30;
          gltf.scene.position.z = 0;
          console.log(gltf.scene);
          console.log(gltf.animations[0]);
          this.mixer4 = new THREE.AnimationMixer(gltf.scene);
          this.mixer4.clipAction(gltf.animations[0]).play();
          //this.creatClipAction(clip, this.mixer4);
          // const animationClip = gltf.scene.animations.find(animationClip => animationClip.name === "Walk");
          // this.mixer2 = new THREE.AnimationMixer(leftSideGroup);
          // this.AnimationMixer.clipAction(animationClip).play();
          scene.add(gltf.scene);
          this.renderScene();
        },
        undefined,
        function(error) {
          console.log(2);
          console.error(error);
        }
      );
    },
    // getTexture() {
    //   let texture = new THREE.TextureLoader();
    //   const bg = texture.load("./Unknown.png");
    //   let cubeGeometry = new THREE.BoxGeometry(2, 12, 6);
    //   let cubeMaterial = new THREE.MeshLambertMaterial({map: bg});//, wireframe: true
    //   let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // },
    createSprite(size, transparent, opacity, color, spriteNumber, range) {
      let spriteMaterial = new THREE.SpriteMaterial({
        opacity: opacity,
        color: color,
        transparent: transparent,
        map: this.getTexture()
      });

      // we have 1 row, with five sprites
      spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteNumber, 0);
      spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
      spriteMaterial.depthTest = false;

      spriteMaterial.blending = THREE.AdditiveBlending;

      let sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(size, size, size);
      sprite.position.set(
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
        Math.random() * range - range / 2
      );
      sprite.velocityX = 5;

      return sprite;
    },
    // 创建纸箱展开面（以中间底面为中心，上下左右各为一组，动画以组(group)为单位）
    // 动画旋转轴由group坐标控制
    creatGroup(x, y, z, groupName, newCube) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.add(newCube);
      group.name = groupName;
      return group;
    },
    // 创建动画轨迹
    creatClip(group, attributeName, times, clipName, duration, rotationValues) {
      const rotationTrack = new THREE.KeyframeTrack(
        attributeName, // 指定对象中的变形目标为Y轴旋转属性
        times, // 关键帧的时间数组
        rotationValues ? rotationValues : this.rotationValues // 与时间数组中的时间点相关的值组成的数组
      );

      // 动画剪辑
      const clip = new THREE.AnimationClip(
        clipName, // 此剪辑的名称
        duration, // 如果传入负数，持续时间将会从传入的数组中计算得到
        [rotationTrack] // 一个由关键帧轨道（KeyframeTracks）组成的数组。
      );

      return clip;
    },
    // 下发剪辑动作
    creatClipAction(clip, mixer) {
      const AnimationAction = mixer.clipAction(clip); // 返回所传入的剪辑参数的AnimationAction
      AnimationAction.timeScale = 1; // 可以调节播放速度，默认是1。为0时动画暂停。值为负数时动画会反向执行。
      AnimationAction.play();
    },
    // 过滤出需要执行动画的关闭的立方体面（已弃用）
    CloseCube() {
      for (let scene of this.scene.children) {
        if (scene.tip === 1) {
          console.log(scene);
          scene.rotateY(-0.5 * Math.PI);
        }
      }
    },
    // 创建立方体
    createCube(width, height, depth, x, y, z, tip) {
      let cubeGeometry = new THREE.BoxGeometry(width, height, depth);
      let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xc79463 }); //, wireframe: true
      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      // 为物体投射阴影
      cube.castShadow = true;
      // position the cube
      cube.rotateX(-0.5 * Math.PI);
      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;
      cube.tip = tip;

      // add the cube to the scene
      return cube;
    },
    // 创建地平面
    createPlane() {
      let planeGeometry = new THREE.PlaneGeometry(160, 160);
      // 设置地平面外观
      let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);

      // 为地平面投射阴影
      plane.receiveShadow = true;

      // rotate and position the plane
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 0;
      plane.position.y = 0;
      plane.position.z = 0;

      // add the plane to the scene
      return plane;
    },
    // 创建几何体网格
    createMesh(geom) {
      // assign two materials
      let meshMaterial = new THREE.MeshNormalMaterial();
      meshMaterial.side = THREE.DoubleSide;
      let wireFrameMat = new THREE.MeshBasicMaterial();
      wireFrameMat.wireframe = true;

      // create a multimaterial
      let mesh = SceneUtils.createMultiMaterialObject(geom, [
        meshMaterial,
        wireFrameMat
      ]);

      return mesh;
    },
    // 二维模型（没有使用）
    drawShape() {
      // create a basic shape
      let shape = new THREE.Shape();

      // start point
      shape.moveTo(10, 10);

      // straight line upwards
      shape.lineTo(10, 40);

      // the top of the figure, curve to the right
      shape.bezierCurveTo(15, 25, 25, 25, 30, 40);

      // spline back down
      shape.splineThru([
        new THREE.Vector2(32, 30),
        new THREE.Vector2(28, 20),
        new THREE.Vector2(30, 10)
      ]);

      // curve at the bottom
      shape.quadraticCurveTo(20, 15, 10, 10);

      // add 'eye' hole one
      let hole1 = new THREE.Path();
      hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
      shape.holes.push(hole1);

      // add 'eye hole 2'
      let hole2 = new THREE.Path();
      hole2.absellipse(23, 25, 2, 3, 0, Math.PI * 2, true);
      shape.holes.push(hole2);

      // add 'mouth'
      let hole3 = new THREE.Path();
      hole3.absarc(20, 16, 2, 0, Math.PI, true);
      shape.holes.push(hole3);

      // return the shape
      return shape;
    },

    renderScene() {
      // this.cube.rotation.x += 0.005;
      // this.cube.rotation.y += 0.005;
      // this.cube.rotation.z += 0.005;

      // 通过 正玄、余玄 计算出几何体运动轨迹
      // this.step += 0.04;
      // this.sphere.position.x = 20 + 10*(Math.cos(this.step))
      // this.sphere.position.y = 2 + 10*Math.abs(Math.sin(this.step))
      let delta = this.clock.getDelta();
      this.mixer.update(delta);
      this.mixer1.update(delta);
      this.mixer2.update(delta);
      this.mixer3.update(delta);
      this.mixer4.update(delta);
      this.controls.update();
      requestAnimationFrame(this.renderScene);
      this.renderer.render(this.scene, this.camera);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
