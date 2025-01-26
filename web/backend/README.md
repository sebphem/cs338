# Intro to backend

## Getting Started

Windows:

``` bash
python -m venv venv
venv/Scripts/activate
python -m pip install -r requirements.txt
mkdir logging
"" > ./logging/api.log
```

For powershell, you can check the install of the venv with

```bash
Get-command python
```

Mac/Linux:

```bash
python -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
mkdir logging
touch logging/api.log
```

## Running the backend

```bash
python api.py --port PORT_NUMBER
```
