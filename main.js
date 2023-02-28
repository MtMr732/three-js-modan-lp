import * as THREE from "three";
import * as dat from "lil-gui"
import './style.css';

//UIデバッグ
const gui = new dat.GUI();



// canvas
const canvas = document.querySelector(".webgl");

//シーン
const scene = new THREE.Scene();

// sizes
const sizes = {
  width:window.innerWidth,
  height :window.innerHeight,
}

//カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas:canvas,
  alpha:true,
})
renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//オブジェクトを作成
const material = new THREE.MeshPhysicalMaterial({
  color :"#3c94d7",
  metalness:0.86,
  roughness:0.37,
  flatShading:true,
})

gui.addColor(material,"color");
gui.add(material,"metalness").min(0).max(1).step(0.01);
gui.add(material,"roughness").min(0).max(1).step(0.01);


const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1,0.4,16,60),material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(),material);
const mesh3 = new THREE.Mesh(new THREE.TorusGeometry(0.8,0.35,100,16),material);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(),material);

//回転用に配置する
mesh1.position.set(2,0,0);
mesh2.position.set(-1,0,0);
mesh3.position.set(2,0,-6);
mesh4.position.set(2,0,0);

scene.add(mesh1,mesh2,mesh3,mesh4);

const meshes = [mesh1,mesh2,mesh3,mesh4];

//パーティクルを追加
 //ジオメトリ
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const postionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3 ; i++){
  postionArray[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute("position",new THREE.BufferAttribute(postionArray,3))

 //マテリアル
 const particleMaterial = new THREE.PointsMaterial({
  size:0.025,
  color:"#ffffff",
 })

 //メッシュ化
 const particles = new THREE.Points(particlesGeometry,particleMaterial)
scene.add(particles);


//ライト
const directionalLight = new THREE.DirectionalLight("ffffff",4)
directionalLight.position.set(0.5,1,0);
scene.add(directionalLight);

window.addEventListener("resize",()=>{
  //サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //レンダラーのアップデート
  renderer.setSize(sizes.width,sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.render(scene,camera);
  console.log("1");
});


//ホイールを実装
let speed = 0;
let rotation = 0;
window.addEventListener("wheel",(event)=>{
  speed += event.deltaY * 0.0002;
  console.log(speed);
})

function rot() {
  rotation += speed;
  speed *= 0.93;

  //ジオメトリ全体を回転させる
  //
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);

  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);

  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);

  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));

  window.requestAnimationFrame(rot);
}
rot();

//カーソルの位置を取得
  const cursor = {};
  cursor.x = 0;
  cursor.y = 0;
  window.addEventListener("mousemove",(e)=>{
    cursor.x = e.clientX / sizes.width -0.5;
    cursor.y = e.clientY / sizes.height -0.5;
    console.log(cursor.y );
  })


//アニメーション
const clock = new THREE.Clock();

const animate = () => {
  renderer.render(scene,camera);

  let getDeltaTime = clock.getDelta();

  //meshを回転
  for(const mesh of meshes){
    mesh.rotation.x += 0.1 * getDeltaTime;
    mesh.rotation.y += 0.12 * getDeltaTime;
  }

  //カメラの制御(カーソルの位置にカメラが移動する)
  camera.position.x += cursor.x * getDeltaTime * 2;
  camera.position.y += -cursor.y * getDeltaTime * 2;

  window.requestAnimationFrame(animate);
}

animate();