"""
setup.py
One-click setup script for ResumeIQ AI backend.
Creates required directories, generates training data, and trains the ML model.
"""

import os
import sys
import subprocess


def create_directories():
    """Create required directories."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dirs = [
        os.path.join(script_dir, 'uploads'),
        os.path.join(script_dir, 'ml', 'models'),
        os.path.join(script_dir, 'ml', 'data'),
        os.path.join(script_dir, 'instance'),
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        print(f"  [OK] Directory ready: {d}")


def run_script(script_path: str, description: str):
    """Run a Python script as a subprocess."""
    print(f"\n  Running: {description}")
    result = subprocess.run(
        [sys.executable, script_path],
        capture_output=False,
        text=True,
    )
    if result.returncode != 0:
        print(f"  [FAIL] {description} failed with return code {result.returncode}")
        sys.exit(result.returncode)
    print(f"  [OK] {description} completed successfully")


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))

    print("=" * 60)
    print("  ResumeIQ AI - Backend Setup")
    print("=" * 60)

    # Step 1: Create directories
    print("\n[Step 1/3] Creating directories...")
    create_directories()

    # Step 2: Generate synthetic training data
    print("\n[Step 2/3] Generating synthetic training data...")
    generate_script = os.path.join(script_dir, 'ml', 'generate_data.py')
    if os.path.exists(generate_script):
        run_script(generate_script, "ml/generate_data.py")
    else:
        print(f"  [FAIL] Script not found: {generate_script}")
        sys.exit(1)

    # Step 3: Train the ML model
    print("\n[Step 3/3] Training ML model...")
    train_script = os.path.join(script_dir, 'ml', 'train.py')
    if os.path.exists(train_script):
        run_script(train_script, "ml/train.py")
    else:
        print(f"  [FAIL] Script not found: {train_script}")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("  [OK] Setup Complete!")
    print("=" * 60)
    print("\nTo start the backend server:")
    print("  python run.py")
    print("\nServer will run at: http://localhost:5000")
    print("=" * 60)


if __name__ == '__main__':
    main()
