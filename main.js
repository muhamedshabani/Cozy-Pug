import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js'
let scene,
	camera,
	renderer,
	toggler = true

// LOADER
let loader = new THREE.GLTFLoader()

function init() {
	scene = new THREE.Scene()
	scene.background = new THREE.TextureLoader().load('resource/background.jpg')

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	camera = new THREE.PerspectiveCamera(
		5,
		window.innerWidth / window.innerHeight,
		0.1,
		15000
	)

	camera.position.x = 90
	camera.position.y = 70
	camera.position.z = 180

	let controls = new OrbitControls(camera, renderer.domElement)

	//LIGHTS
	var ambiColor = 0x8c8c8c
	var ambientLight = new THREE.AmbientLight(ambiColor)
	scene.add(ambientLight)

	var dLight = new THREE.DirectionalLight(0xffffff, 0.5)
	dLight.position.set(-200, 200, -400)
	scene.add(dLight)

	var pLight = new THREE.PointLight(0x606060, 1.0)
	pLight.position.set(0, 10, 0)
	scene.add(pLight)

	var axes = new THREE.AxesHelper(30)
	//scene.add(axes)

	// FLOOR AND WALLS

	// 1. adding the FLOOR
	var floorFacesMaterials = [
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('resource/ground.jpg'),
		}),
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('resource/ground.jpg'),
		}),
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('resource/groundForTopside.jpg'),
		}),
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('resource/groundForTopside.jpg'),
		}),
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('resource/under.jpg'),
		}), // UNDER
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('resource/floor.jpg'),
		}), // TOPSIDE
	]
	var floorPNG = new THREE.TextureLoader().load('resource/floor.jpg')
	var floor = new THREE.Mesh(
		new THREE.BoxGeometry(15, 15, 5),
		floorFacesMaterials
	)
	floor.rotation.x = 1.5708
	floor.position.y = -2
	scene.add(floor)

	// 2. adding the walls
	var wall2PNG = new THREE.TextureLoader().load('resource/retrowall.jpg')

	var wall = new THREE.Mesh(
		new THREE.BoxGeometry(15, 15, 0.15),
		new THREE.MeshBasicMaterial({ map: wall2PNG })
	)
	wall.rotation.y = 0
	wall.position.x = -0.02
	wall.position.y = 4
	wall.position.z = -7.4
	scene.add(wall)

	var wall2 = new THREE.Mesh(
		new THREE.BoxGeometry(15, 15, 0.15),
		new THREE.MeshBasicMaterial({ map: wall2PNG })
	)
	wall2.rotation.y = (90 * Math.PI) / 180
	wall2.position.x = -7.4
	wall2.position.y = 4
	wall2.position.z = -0.02
	scene.add(wall2)

	var outerwallPNG = new THREE.TextureLoader().load('resource/outerwalls.jpg')

	var outerwall = new THREE.Mesh(
		new THREE.BoxGeometry(15, 11, 0.35),
		new THREE.MeshBasicMaterial({ map: outerwallPNG })
	)
	outerwall.rotation.y = (90 * Math.PI) / 180
	outerwall.position.x = -7.7
	outerwall.position.y = 6
	outerwall.position.z = 0
	scene.add(outerwall)

	var outerwall2 = new THREE.Mesh(
		new THREE.BoxGeometry(15, 11, 0.35),
		new THREE.MeshBasicMaterial({ map: outerwallPNG })
	)
	outerwall2.rotation.y = 0
	outerwall2.position.x = 0
	outerwall2.position.y = 6
	outerwall2.position.z = -7.7
	scene.add(outerwall2)

	// CARPET
	loader.load('models/carpet/scene.gltf', function (gltf) {
		var carpet = gltf.scene.children[0]
		carpet.position.set(0, 0.5, 0)
		carpet.scale.set(3, 5, 2)
		scene.add(carpet)
		animate()
	})

	// SOFA
	loader.load('models/sofa/scene.gltf', function (gltf) {
		var sofa = gltf.scene.children[0]
		sofa.position.set(0, 0.5, -5.5)
		sofa.scale.set(0.03, 0.03, 0.03)
		scene.add(sofa)
		animate()
	})

	// EGG CHAIR
	var eggchair
	loader.load('models/eggchair/scene.gltf', function (gltf) {
		eggchair = gltf.scene.children[0]
		eggchair.rotation.z = (270 * Math.PI) / 180
		eggchair.position.set(5, 2.3, 0)
		eggchair.scale.set(3, 3, 3)
		eggchair.material = new THREE.MeshLambertMaterial({
			color: 0x7f0000,
		})
		scene.add(eggchair)
		animate()
	})

	// CYLINDER FOR CHAIR
	const geometry = new THREE.CylinderGeometry(1.19, 1.19, 0.5, 32)
	const material = new THREE.MeshPhongMaterial({
		color: 0x540f00,
		specular: 0x00000,
		shininess: 30,
	})
	const cylinder = new THREE.Mesh(geometry, material)
	cylinder.position.set(4.9, 0.6, 0)
	scene.add(cylinder)

	// DOG ON CHAIR
	var dog
	loader.load('models/dog/scene.gltf', function (gltf) {
		dog = gltf.scene.children[0]
		dog.rotation.z = (270 * Math.PI) / 180
		dog.position.set(4.52, 1.55, 0)
		dog.scale.set(4, 4, 4)
		scene.add(dog)
	})

	// TABLE
	loader.load('models/table/scene.gltf', function (gltf) {
		var table = gltf.scene.children[0]
		table.position.set(0.3, 0.5, 0)
		table.scale.set(0.042, 0.042, 0.042)
		scene.add(table)
	})

	// LAPTOP ON TABLE
	loader.load('models/laptop/scene.gltf', function (gltf) {
		var laptop = gltf.scene.children[0]
		laptop.position.set(-0.5, 2.3, -0.5)
		laptop.scale.set(3, 3, 3)
		laptop.rotation.z = (150 * Math.PI) / 180
		scene.add(laptop)
	})

	// COFFEE ON TABLE
	loader.load('models/coffee/scene.gltf', function (gltf) {
		var coffee = gltf.scene.children[0]
		coffee.position.set(1.3, 2.3, 0)
		coffee.scale.set(0.004, 0.004, 0.004)
		scene.add(coffee)
	})

	// DONUTS ON TABLE
	loader.load('models/donuts/scene.gltf', function (gltf) {
		var donuts = gltf.scene.children[0]
		donuts.position.set(0.5, 2.3, 0.5)
		donuts.scale.set(0.1, 0.1, 0.1)
		scene.add(donuts)
	})

	// BOOKS ON TABLE
	loader.load('models/books/scene.gltf', function (gltf) {
		var books = gltf.scene.children[0]
		books.position.set(-1.3, 2.3, 2)
		books.scale.set(1, 1, 1)
		scene.add(books)
	})

	// CEILING LAMP
	loader.load('models/ceilinglamp/scene.gltf', function (gltf) {
		var ceilinglamp = gltf.scene.children[0]
		ceilinglamp.position.set(0, 11, 0)
		ceilinglamp.scale.set(0.035, 0.035, 0.035)
		scene.add(ceilinglamp)
	})

	// CEILING LAMP LIGHT
	var spotLight = new THREE.SpotLight(0xffffff, 1.0, 8, Math.PI / 5.0, 0.02, 0)
	spotLight.position.set(0, 8, 0)
	spotLight.target.position.set(0, 0, 0)
	spotLight.castShadow = true

	var helper = new THREE.SpotLightHelper(spotLight)
	//scene.add(helper);
	scene.add(spotLight)

	// LAMP
	loader.load('models/lamp/scene.gltf', function (gltf) {
		var lamp = gltf.scene.children[0]
		lamp.position.set(-5, 0.1, -5)
		lamp.scale.set(0.035, 0.035, 0.035)
		scene.add(lamp)
	})

	// LAMP LIGHT
	var pointLight = new THREE.PointLight(0xff6347, 2, 35, 1)
	pointLight.position.set(-5, 5.2, -5)
	pointLight.castShadow = true
	//scene.add(pointLight);

	// WALL DECOR HEXAGON
	loader.load('models/wallshelf/scene.gltf', function (gltf) {
		var wallshelf = gltf.scene.children[0]
		wallshelf.position.set(-2, 4.5, -7.2)
		wallshelf.scale.set(5.35, 5.35, 5.35)
		wallshelf.material = new THREE.MeshNormalMaterial()
		scene.add(wallshelf)
	})

	// TV STAND
	var redWavePNG = new THREE.TextureLoader().load('resource/redwave.jpg')
	var tvStand = new THREE.Mesh(
		new THREE.CylinderGeometry(2, 2, 2, 32),
		new THREE.MeshBasicMaterial({ map: redWavePNG })
	)
	tvStand.position.set(-6.7, 3, 0)
	tvStand.scale.z += 0.45
	tvStand.scale.y -= 0.6
	tvStand.scale.x -= 0.8
	tvStand.rotation.z = (90 * Math.PI) / 180
	scene.add(tvStand)

	// TV
	loader.load('models/tv/scene.gltf', function (gltf) {
		var tv = gltf.scene.children[0]
		tv.position.set(-7, 5, -0)
		tv.rotation.z = (90 * Math.PI) / 180
		tv.scale.set(0.07, 0.07, 0.07)

		scene.add(tv)
	})

	// VASE
	loader.load('models/vase/scene.gltf', function (gltf) {
		var vase = gltf.scene.children[0]
		vase.position.set(-6, 1, 6)
		vase.rotation.z = (90 * Math.PI) / 180
		vase.scale.set(0.8, 0.8, 0.8)
		scene.add(vase)
	})

	// VASE LEAFS
	var maxInc = 30
	var inc = 1
	var flowers
	loader.load('models/vaseflowers/scene.gltf', function (gltf) {
		flowers = gltf.scene.children[0]
		flowers.position.set(-6, 1.2, 6)
		flowers.scale.set(0.01, 0.01, 0.01)
		scene.add(flowers)
	})

	// ROOMBA VACCUUM CLEANER
	var roomba
	var roombaON = false
	loader.load('models/roomba/scene.gltf', function (gltf) {
		roomba = gltf.scene.children[0]
		roomba.position.set(3, 0.5, 21)
		roomba.scale.set(3, 3, 3)
		scene.add(roomba)
	})

	function animate() {
		setTimeout(function () {
			requestAnimationFrame(animate)
		}, 100)

		renderer.render(scene, camera)
	}

	var maxZplus = (315 * Math.PI) / 180	//limitter for rotating dog and chair
	var maxZminus = (225 * Math.PI) / 180 // limitter for rotating dog and chair

	//var roombaSteps = 900
	//var roombaDirection = false
	//curently removed for maintenance

	//TV controlls
	function chanels(chanel) {
		var cartoonPNG
		switch (chanel) {
			case '0':
				cartoonPNG = new THREE.TextureLoader().load('')
				break
			case '1':
				cartoonPNG = new THREE.TextureLoader().load('resource/rickandmorty.jpg')
				break
			case '2':
				cartoonPNG = new THREE.TextureLoader().load('resource/cartoon.jpg')
				break
			case '3':
				cartoonPNG = new THREE.TextureLoader().load('resource/acihayat.jpg')
				break
		}
		var cartoon = new THREE.Mesh(
			new THREE.BoxGeometry(0.01, 2, 4),
			new THREE.MeshBasicMaterial({ map: cartoonPNG })
		)
		cartoon.position.y = 5
		cartoon.position.x = -6.9
		scene.add(cartoon)
	}
	//Light on/off
	function lightToggle() {
		if (toggler == true) {
			scene.remove(spotLight)
			scene.add(pointLight)
			toggler = false
		} else {
			scene.remove(pointLight)
			scene.add(spotLight)
			toggler = true
		}
	}
	//Gardening kit
	function waterThePlant() {
		if (maxInc >= inc) {
			var newleaf = flowers
			if (inc % 2 == 0) {
				newleaf.scale.x = flowers.scale.x + 0.001
				newleaf.scale.y = flowers.scale.y + 0.001
				newleaf.scale.z = flowers.scale.z + 0.01
			}
			inc += 1
			scene.add(newleaf)
		}
	}
	//Chair rotations
	function chairSwivel(key) {
		if (key == ']' && !(eggchair.rotation.z <= maxZminus)) {
			eggchair.rotation.z -= 0.01
			dog.rotation.z -= 0.01
		} else if (!(eggchair.rotation.z >= maxZplus)) {
			eggchair.rotation.z += 0.01
			dog.rotation.z += 0.01
		}
	}

	document.body.addEventListener('keypress', (event) => {
		switch (event.key) {
			case '0':
			case '1':
			case '2':
			case '3':
				chanels(event.key)
				break
			case 't':
				lightToggle()
				break
			case 'w':
				waterThePlant()
				break
			case '[':
			case ']':
				chairSwivel(event.key)
				break
			case 'c':
				document.getElementById('helpList').classList.toggle('visible')
				break
		}
	})
}

init()
setTimeout(() => {
	alert("Press 'c' to view comand Tab")
}, 1350)
