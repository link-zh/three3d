init() {
    console.log('using THREE.js version:' + THREE.REVISION);

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    // 创建一个场景
    let scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    // 创建一个相机📷
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    // 创建一个渲染器
    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 启用阴影
    renderer.shadowMap.enabled = true;

    // show axes in the screen
    let axes = new THREE.AxisHelper(30);
    // 将坐标轴添加到场景中
    scene.add(axes);

    // create the ground plane
    // 定义地平面的大小
    let planeGeometry = new THREE.PlaneGeometry(60, 30);
    // 设置地平面外观
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // 为地平面投射阴影
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    // create a cube
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});//, wireframe: true
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // 为物体投射阴影
    cube.castShadow = true;

    // position the cube
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    // create a sphere
    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // 为物体投射阴影
    sphere.castShadow = true;

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;

    // add the sphere to the scene
    scene.add(sphere);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-60, 40, 10);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024,1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);
    //let shape = this.createMesh(new THREE.ShapeGeometry(this.drawShape()));
    // add the sphere to the scene
    let x = 0, y = 0;

    let heartShape = new THREE.Shape();

    heartShape.moveTo( x + 5, y + 5 );
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

    let geometry = new THREE.ShapeGeometry( heartShape );
    let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    let mesh = new THREE.Mesh( geometry, material ) ;
    scene.add(mesh);

    // add the output of the renderer to the html element
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    this.controls = new TrackballControls(camera, renderer.domElement)
    this.controls.update()
    // render the scene
    //renderer.render(scene, camera);
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.cube = cube;
    this.sphere = sphere;
    // console.log(Math.sin(0.52358));
    // let a = initTrackballControls(camera)
    this.renderScene()
},
createMesh(geom) {

    // assign two materials
    let meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    let wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    // create a multimaterial
    let mesh = SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

    return mesh;
},
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
    shape.splineThru(
        [new THREE.Vector2(32, 30),
            new THREE.Vector2(28, 20),
            new THREE.Vector2(30, 10),
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


renderScene(){
    this.cube.rotation.x += 0.005;
    this.cube.rotation.y += 0.005;
    this.cube.rotation.z += 0.005;

    this.step += 0.04;
    this.sphere.position.x = 20 + 10*(Math.cos(this.step))
    this.sphere.position.y = 2 + 10*Math.abs(Math.sin(this.step))
    this.controls.update()
    requestAnimationFrame(this.renderScene);
    this.renderer.render(this.scene, this.camera);
},

