 var windowWidth = window.innerWidth,
     windowHeight = window.innerHeight;
 var camera, renderer, scene;

 // add your global variables here:
 var helloWorldMesh;
 var world, worldClouds, t, c, l;
 var mesh1, mesh2, mesh3;
 //var sizeM = 45;
 var sizeM = 50;
 var sizeMesh1 = sizeM,
     sizeMesh2 = sizeM,
     sizeMesh3 = sizeM;
 var depthCompress = 0.3;
 var z0 = -5;
 var worldRadius = 15;
 var textRadius = 1.75 * worldRadius;
 var relcoeff = -0.3;
 var spotLight;

 head.ready(function() {
     Init();
     animate();
 });

 function Init() {
     scene = new THREE.Scene();

     //setup camera
     camera = new LeiaCamera({
         cameraPosition: new THREE.Vector3(_camPosition.x, _camPosition.y, _camPosition.z),
         targetPosition: new THREE.Vector3(_tarPosition.x, _tarPosition.y, _tarPosition.z)
     });
     scene.add(camera);

     //setup rendering parameter
     renderer = new LeiaWebGLRenderer({
         antialias: true,
         renderMode: _renderMode,
         shaderMode: _nShaderMode,
         colorMode: _colorMode,
         compFac: _depthCompressionFactor,
         devicePixelRatio: 1
     });
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
     renderer.Leia_setSize({
         width: windowWidth,
         height: windowHeight,
         autoFit: true
     });
     document.body.appendChild(renderer.domElement);

     //add object to Scene
     addObjectsToScene();

     //add Light
     addLights();

     //add Gyro Monitor
     //addGyroMonitor();
 }

 function animate() {
     requestAnimationFrame(animate);

     var time = LEIA.time;
     mesh1.rotation.set(Math.sin(3.2 * time), 0.3 * Math.sin(2.7 * time), 0.5 * Math.sin(4 * time));
     mesh1.position.z = 4;
     var rx = 1.0;
     var gx = 0.0;
     var bx = Math.sin(0.23 * time + 0.3) * Math.sin(0.23 * time + 0.3);
     mesh1.material.color.r = rx;
     mesh1.material.color.g = gx;
     mesh1.material.color.b = bx;
     renderer.Leia_render({
         scene: scene,
         camera: camera,
         holoScreenSize: _holoScreenSize,
         holoCamFov: _camFov,
         upclip: _up,
         downclip: _down,
         filterA: _filterA,
         filterB: _filterB,
         filterC: _filterC,
         messageFlag: _messageFlag
     });
 }

 function addObjectsToScene() {
     //Add your objects here
     var worldTexture = new THREE.ImageUtils.loadTexture('resource/world_texture.jpg');
     worldTexture.wrapS = worldTexture.wrapT = THREE.RepeatWrapping;
     worldTexture.repeat.set(1, 1);
     var worldMaterial = new THREE.MeshPhongMaterial({
         map: worldTexture,
         bumpMap: THREE.ImageUtils.loadTexture('resource/world_elevation.jpg'),
         bumpScale: 1.00,
         specularMap: THREE.ImageUtils.loadTexture('resource/world_water.png'),
         specular: new THREE.Color('grey'),
         //color: 0xffdd99
     });
     var worldGeometry = new THREE.SphereGeometry(worldRadius, 30, 30);
     world = new THREE.Mesh(worldGeometry, worldMaterial);
     world.position.z = z0;
     world.castShadow = true;
     world.receiveShadow = true;
     //scene.add(world);

     var planeTexture = new THREE.ImageUtils.loadTexture('resource/world_galaxy_starfield.png');
     planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
     planeTexture.repeat.set(1, 1);
     var planeMaterial = new THREE.MeshPhongMaterial({
         map: planeTexture,
         color: 0xffdd99
     });
     var planeGeometry = new THREE.PlaneGeometry(80, 60, 10, 10);
     console.log(planeGeometry);
     for (var i = 0; i < (planeGeometry.vertices.length); i++) {
         var qq = planeGeometry.vertices[i].x;
         planeGeometry.vertices[i].z = 0.005 * qq * qq;
     }
     plane = new THREE.Mesh(planeGeometry, worldMaterial);
     plane.position.z = -8;
     plane.castShadow = false;
     plane.receiveShadow = true;
     scene.add(plane);

     readSTLs('resource/AUO2.stl', '', '');
 }

 function addLights() {
     //Add Lights Here
     var light = new THREE.SpotLight(0xffffff);
     light.position.set(70, 70, 70);
     light.shadowCameraVisible = false;
     light.castShadow = true;
     light.shadowMapWidth = light.shadowMapHeight = 512;
     light.shadowDarkness = 0.7;
     scene.add(light);

     var ambientLight = new THREE.AmbientLight(0x888888);
     scene.add(ambientLight);
 }

 function readSTLs(filename1, filename2, filename3) {
     var xhr1 = new XMLHttpRequest();
     xhr1.onreadystatechange = function() {
         if (xhr1.readyState === 4) {
             if (xhr1.status === 200 || xhr1.status === 0) {
                 var rep = xhr1.response; // || xhr1.mozResponseArrayBuffer;
                 //mesh1 = parseStlBinary(rep, 0xffffff);
                 mesh1 = parseStlBinary(rep, 0xff00ff);
                 mesh1.material.side = THREE.DoubleSide;
                 mesh1.castShadow = true;
                 mesh1.receiveShadow = true;
                 mesh1.material.metal = true;

                 mesh1.scale.set(sizeMesh1, sizeMesh1, sizeMesh1);
                 scene.add(mesh1);
                 newMeshReady = true;
                 console.log(mesh1);
             }
         }
     };
     xhr1.onerror = function(e) {
         console.log(e);
     };
     xhr1.open("GET", filename1, true);
     xhr1.responseType = "arraybuffer";
     xhr1.send(null);
 }