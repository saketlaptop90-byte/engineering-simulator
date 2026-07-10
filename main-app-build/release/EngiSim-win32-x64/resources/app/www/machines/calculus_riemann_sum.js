import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom High-Tech Neon Materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.8,
        side: THREE.DoubleSide
    });

    const neonMagenta = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.5
    });

    const scannerMat = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    // 1. Base Grid Platform
    const baseGeo = new THREE.BoxGeometry(12, 0.4, 4);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.2, 0);
    group.add(baseMesh);

    parts.push({
        name: "Coordinate Base Platform",
        description: "A dark steel foundational grid system representing the continuous mathematical x-z plane.",
        material: "darkSteel",
        function: "Provides the spatial coordinate system framework for function evaluation.",
        assemblyOrder: 1,
        connections: ["Cartesian Axes", "Riemann Rectangles"],
        failureEffect: "Loss of the spatial reference frame, rendering integration bounds undefined.",
        cascadeFailures: ["Cartesian Axes", "Function Curve Simulation"],
        originalPosition: { x: 0, y: -0.2, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    // 2. Cartesian Axes
    const axesGroup = new THREE.Group();
    const axisGeo = new THREE.CylinderGeometry(0.04, 0.04, 12);
    const xAxis = new THREE.Mesh(axisGeo, chrome);
    xAxis.rotation.z = Math.PI / 2;
    axesGroup.add(xAxis);

    const yAxisGeo = new THREE.CylinderGeometry(0.04, 0.04, 8);
    const yAxis = new THREE.Mesh(yAxisGeo, chrome);
    yAxis.position.y = 4;
    axesGroup.add(yAxis);

    group.add(axesGroup);

    parts.push({
        name: "Cartesian Reference Axes",
        description: "High-precision chrome cylindrical axes for X and Y dimensions.",
        material: "chrome",
        function: "Defines the physical dimensions of the integration domain and codomain.",
        assemblyOrder: 2,
        connections: ["Coordinate Base Platform"],
        failureEffect: "Unable to measure function height or domain width.",
        cascadeFailures: ["Riemann Rectangles"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1, z: -3 }
    });

    // 3. Mathematical Curve f(x)
    const curvePoints = [];
    const minX = -5;
    const maxX = 5;
    const steps = 150;
    
    // Function: f(x) = sin(x) + cos(2x)*0.5 + 2.5
    const f = (x) => Math.sin(x) + Math.cos(2*x)*0.5 + 2.5;

    for (let i = 0; i <= steps; i++) {
        const x = minX + (maxX - minX) * (i / steps);
        const y = f(x);
        curvePoints.push(new THREE.Vector3(x, y, 0));
    }

    const curveGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(curvePoints),
        150,
        0.06,
        8,
        false
    );
    const curveMesh = new THREE.Mesh(curveGeo, neonMagenta);
    group.add(curveMesh);

    parts.push({
        name: "Integrand Curve f(x)",
        description: "A highly stylized, glowing neon magenta 3D tube representing the continuous function.",
        material: "neonMagenta",
        function: "Acts as the upper boundary for the integral accumulation.",
        assemblyOrder: 3,
        connections: ["Cartesian Reference Axes"],
        failureEffect: "Missing integrand function.",
        cascadeFailures: ["Riemann Rectangles", "Integration Scanner Laser"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 2 }
    });

    // 4. Riemann Rectangles
    const rectanglesGroup = new THREE.Group();
    const rectMeshes = [];
    const maxRects = 100; // High resolution limit
    
    for (let i = 0; i < maxRects; i++) {
        const dx = (maxX - minX) / maxRects;
        const x = minX + i * dx + dx / 2; // Midpoint evaluation
        const height = f(x);
        
        const rectGeo = new THREE.BoxGeometry(dx * 0.85, height, 0.4);
        rectGeo.translate(0, height / 2, 0); // Pivot at the base
        
        const rectMesh = new THREE.Mesh(rectGeo, neonCyan.clone()); // Clone for individual opacity animation
        rectMesh.position.set(x, 0, 0);
        rectanglesGroup.add(rectMesh);
        rectMeshes.push({ mesh: rectMesh, x: x, height: height, dx: dx });
    }
    
    group.add(rectanglesGroup);

    parts.push({
        name: "Discrete Area Accumulators",
        description: "An array of dynamic neon cyan rectangular prisms under the curve.",
        material: "neonCyan",
        function: "Calculates the approximate definite integral via discrete summation.",
        assemblyOrder: 4,
        connections: ["Coordinate Base Platform", "Integrand Curve f(x)"],
        failureEffect: "Integral approximation calculation fails entirely.",
        cascadeFailures: ["Integration Scanner Laser"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 4 }
    });

    // 5. Area Scanner (Laser)
    const scannerGeo = new THREE.BoxGeometry(0.05, 8, 1.2);
    const scannerMesh = new THREE.Mesh(scannerGeo, scannerMat);
    scannerMesh.position.set(minX, 4, 0);
    group.add(scannerMesh);

    parts.push({
        name: "Integration Scanner Laser",
        description: "A high-tech additive blending red laser sweeping across the domain.",
        material: "Scanner Red",
        function: "Visualizes the continuous accumulation function F(x) traversing the domain.",
        assemblyOrder: 5,
        connections: ["Cartesian Reference Axes"],
        failureEffect: "Cannot track the progression of the limit.",
        cascadeFailures: [],
        originalPosition: { x: -5, y: 4, z: 0 },
        explodedPosition: { x: -6, y: 6, z: -2 }
    });

    const description = "The Ultra High-Tech Riemann Sum Machine visually demonstrates the fundamental theorem of calculus: approximating the area under a curve by summing the areas of discrete rectangles, dynamically adjusting resolution to visualize the limit as N approaches infinity.";

    const quizQuestions = [
        {
            question: "What happens to the Riemann Sum approximation as the number of rectangles (N) approaches infinity?",
            options: [
                "It diverges to infinity.",
                "It approaches the exact area under the curve (the definite integral).",
                "It becomes exactly zero.",
                "It oscillates unpredictably."
            ],
            correct: 1,
            explanation: "As N approaches infinity, the width of each rectangle (dx) approaches 0, and the sum of their areas converges to the exact definite integral of the continuous function.",
            difficulty: "easy"
        },
        {
            question: "In this visualizer, which Riemann sum evaluation method is primarily represented by the rectangles perfectly aligning their horizontal center with the curve?",
            options: [
                "Left Riemann Sum",
                "Right Riemann Sum",
                "Midpoint Riemann Sum",
                "Trapezoidal Rule"
            ],
            correct: 2,
            explanation: "The Midpoint Riemann Sum uses the function value at the exact midpoint of each subinterval dx to determine the height of the corresponding rectangle.",
            difficulty: "medium"
        },
        {
            question: "If the neon integrand curve f(x) represents the power output of a generator over time, what does the total accumulated volume of the Riemann Rectangles represent?",
            options: [
                "The generator's maximum voltage.",
                "The total energy generated over that time period.",
                "The average power output.",
                "The derivative of the power curve."
            ],
            correct: 1,
            explanation: "Power is the rate of energy generation. Integrating power with respect to time yields the total energy produced. The sum of the areas represents this accumulated energy.",
            difficulty: "hard"
        }
    ];

    const meshes = {
        scanner: scannerMesh,
        rects: rectMeshes,
        maxRects: maxRects,
        minX: minX,
        maxX: maxX
    };

    function animate(time, speed, passedMeshes) {
        const cycle = (time * speed * 0.4) % (Math.PI * 2);
        
        // Scanner sweeps left to right and back
        const t = (Math.sin(cycle) + 1) / 2; // 0 to 1
        const scanPos = meshes.minX + t * (meshes.maxX - meshes.minX);
        meshes.scanner.position.x = scanPos;

        // Dynamic Resolution Simulation (N changing over time)
        // Cycles between coarse (10), medium (25), fine (50), ultra (100)
        const resCycle = Math.floor(time * speed * 0.15) % 4;
        let activeN = meshes.maxRects;
        if (resCycle === 0) activeN = 10;
        else if (resCycle === 1) activeN = 25;
        else if (resCycle === 2) activeN = 50;
        else activeN = 100;

        const nStep = Math.floor(meshes.maxRects / activeN);

        meshes.rects.forEach((rectData, index) => {
            const mesh = rectData.mesh;
            
            // Only display rectangles matching the current resolution
            if (index % nStep === 0) {
                mesh.visible = true;
                mesh.scale.x = nStep; // Scale width to cover the gap
                
                const dist = Math.abs(mesh.position.x - scanPos);
                
                // Emissive pulse near the scanner
                if (dist < 1.5) {
                    mesh.material.emissiveIntensity = 0.8 + (1.5 - dist);
                    mesh.material.opacity = 0.9;
                } else {
                    mesh.material.emissiveIntensity = 0.4;
                    mesh.material.opacity = 0.6;
                }

                // Sweeping build-up animation
                if (Math.cos(cycle) > 0) { // Sweeping right
                    if (mesh.position.x <= scanPos) {
                        mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, 1, 0.2);
                    } else {
                        mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, 0.01, 0.2);
                    }
                } else { // Sweeping left
                    if (mesh.position.x >= scanPos) {
                        mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, 1, 0.2);
                    } else {
                        mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, 0.01, 0.2);
                    }
                }
            } else {
                mesh.visible = false;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRiemannSum() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
