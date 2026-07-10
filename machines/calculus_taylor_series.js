import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();

    // Custom high-tech neon materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
    });

    const neonMagenta = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.8,
    });

    const neonYellow = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.7,
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff8800,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.6,
    });

    const neonWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2.0,
    });

    const parts = [];

    // 1. Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(5, 5.5, 0.5, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -3, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    parts.push({
        name: 'Quantum Base Pedestal',
        description: 'Stabilizes the mathematical projection field.',
        material: 'darkSteel',
        function: 'Provides a foundational coordinate system anchor for the Taylor polynomial display.',
        assemblyOrder: 1,
        connections: ['Coordinate Grid'],
        failureEffect: 'Projection field destabilizes',
        cascadeFailures: ['All Polynomial Visualizations'],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 },
        mesh: baseMesh
    });

    // 2. Coordinate Grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x00ff00, 0x444444);
    gridHelper.position.set(0, -2.7, 0);
    group.add(gridHelper);

    // 3. True Function: f(x) = sin(x)
    class CustomSinCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = (t * 10) - 5;
            const y = Math.sin(x);
            return optionalTarget.set(x, y, 0).multiplyScalar(this.scale);
        }
    }
    const sinPath = new CustomSinCurve(1);
    const sinGeo = new THREE.TubeGeometry(sinPath, 100, 0.08, 8, false);
    const sinMesh = new THREE.Mesh(sinGeo, neonCyan);
    group.add(sinMesh);

    parts.push({
        name: 'True Function Anchor: f(x) = sin(x)',
        description: 'The exact transcendental function being modeled.',
        material: 'neonCyan',
        function: 'Acts as the ground truth reference for all polynomial approximations.',
        assemblyOrder: 2,
        connections: ['Expansion Point'],
        failureEffect: 'Loss of reference truth',
        cascadeFailures: ['Polynomial Accuracy Sensors'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: sinMesh
    });

    // 4. Expansion Point (Center)
    const centerGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const centerMesh = new THREE.Mesh(centerGeo, neonWhite);
    centerMesh.position.set(0, 0, 0); // x=0, sin(0)=0
    group.add(centerMesh);

    parts.push({
        name: 'Point of Expansion (a=0)',
        description: 'The central singularity from which the Maclaurin series derives.',
        material: 'neonWhite',
        function: 'Focuses computational energy to anchor the polynomial derivatives.',
        assemblyOrder: 3,
        connections: ['True Function Anchor', 'T1', 'T3', 'T5'],
        failureEffect: 'Polynomials lose center alignment',
        cascadeFailures: ['Approximation Divergence'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 },
        mesh: centerMesh
    });

    // Helper to generate polynomial curves
    function createPolyCurve(degree, colorMaterial) {
        class PolyCurve extends THREE.Curve {
            constructor() { super(); }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = (t * 10) - 5;
                let y = 0;
                if (degree >= 1) y += x;
                if (degree >= 3) y -= Math.pow(x, 3) / 6;
                if (degree >= 5) y += Math.pow(x, 5) / 120;
                if (degree >= 7) y -= Math.pow(x, 7) / 5040;
                
                // Clamp Y to prevent massive divergence out of bounds visually
                if (y > 5) y = 5;
                if (y < -5) y = -5;
                
                return optionalTarget.set(x, y, 0);
            }
        }
        const path = new PolyCurve();
        const geo = new THREE.TubeGeometry(path, 100, 0.05, 8, false);
        const mesh = new THREE.Mesh(geo, colorMaterial);
        group.add(mesh);
        return mesh;
    }

    // 5. T1: x
    const t1Mesh = createPolyCurve(1, neonMagenta);
    parts.push({
        name: 'First-Degree Approximation (P1)',
        description: 'Linear tangent projection of the function.',
        material: 'neonMagenta',
        function: 'Captures the instantaneous slope at the expansion point.',
        assemblyOrder: 4,
        connections: ['Expansion Point'],
        failureEffect: 'Loss of linear trend',
        cascadeFailures: ['Higher Order Alignments'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: -3 },
        mesh: t1Mesh
    });

    // 6. T3: x - x^3/3!
    const t3Mesh = createPolyCurve(3, neonYellow);
    parts.push({
        name: 'Third-Degree Approximation (P3)',
        description: 'Cubic correction field.',
        material: 'neonYellow',
        function: 'Adds curvature awareness to the linear projection.',
        assemblyOrder: 5,
        connections: ['T1', 'Expansion Point'],
        failureEffect: 'Inaccurate inflection mapping',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 0, z: -3 },
        mesh: t3Mesh
    });

    // 7. T5: x - x^3/3! + x^5/5!
    const t5Mesh = createPolyCurve(5, neonOrange);
    parts.push({
        name: 'Fifth-Degree Approximation (P5)',
        description: 'Quintic convergence enhancer.',
        material: 'neonOrange',
        function: 'Extends the domain of accurate approximation significantly.',
        assemblyOrder: 6,
        connections: ['T3', 'Expansion Point'],
        failureEffect: 'Premature divergence at extremes',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 3, z: -3 },
        mesh: t5Mesh
    });

    const description = "Calculus Taylor Series Projector: This high-tech apparatus demonstrates the Maclaurin series (Taylor series at a=0) for f(x) = sin(x). The cyan glowing line is the true sine wave. The neon magenta, yellow, and orange lines represent the 1st, 3rd, and 5th degree polynomial approximations, respectively. As the degree increases, the polynomial wraps more tightly around the true function, illustrating convergence.";

    const quizQuestions = [
        {
            question: "In the context of the Taylor series for sin(x) centered at a=0 (Maclaurin series), why are there only odd powers of x?",
            options: [
                "Because sin(x) is an even function.",
                "Because the derivatives of sin(x) evaluated at 0 are 0 for even derivatives.",
                "Because the factorial terms cancel out even powers.",
                "Because the grid only projects odd dimensions."
            ],
            correct: 1,
            explanation: "The n-th derivative of sin(x) alternates between sin, cos, -sin, and -cos. At x=0, sin(0) = 0, so all even derivatives evaluate to 0, leaving only odd powers.",
            difficulty: "Medium"
        },
        {
            question: "What happens to the polynomial approximation P_n(x) as the degree 'n' approaches infinity for sin(x)?",
            options: [
                "It diverges outside a certain radius.",
                "It converges to sin(x) only for values between -1 and 1.",
                "It converges to sin(x) for all real numbers x.",
                "It oscillates wildly."
            ],
            correct: 2,
            explanation: "The Taylor series for sin(x) has an infinite radius of convergence, meaning it perfectly matches the sine function for all real values of x as n goes to infinity.",
            difficulty: "Hard"
        },
        {
            question: "What does the first degree approximation (the linear tangent line) represent conceptually?",
            options: [
                "The area under the curve.",
                "The instantaneous rate of change of the function at the expansion point.",
                "The curvature of the function.",
                "The maximum amplitude."
            ],
            correct: 1,
            explanation: "The first-degree Taylor polynomial is exactly the equation of the tangent line to the function at the expansion point, capturing its instantaneous slope.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the entire group slowly for a 360 viewer effect
        group.rotation.y = time * 0.2 * speed;
        
        // Pulse the expansion point
        const pulse = (Math.sin(time * 3 * speed) + 1) / 2; // 0 to 1
        const scale = 1 + pulse * 0.5;
        centerMesh.scale.set(scale, scale, scale);

        // Adjust opacity/emissiveness of polynomials to make them 'flow' and pulse
        t1Mesh.material.emissiveIntensity = 0.5 + 0.7 * Math.sin(time * 2 * speed);
        t3Mesh.material.emissiveIntensity = 0.5 + 0.7 * Math.sin(time * 2 * speed + Math.PI/3);
        t5Mesh.material.emissiveIntensity = 0.5 + 0.7 * Math.sin(time * 2 * speed + 2*Math.PI/3);

        // Make the true function "breathe" with glowing intensity
        sinMesh.material.emissiveIntensity = 1.5 + 0.5 * Math.sin(time * speed);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTaylorSeries() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
