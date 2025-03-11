sudo apt-get update
sudo apt-get install python3-venv
mkdir
mkdir entornos
ls
cd entornos/
mkdir proyecto
python3 -m venv proyecto/
ls proyecto/
ls proyecto/bin/
source proyecto/bin/activate
clear
pip install django
pip install django-mongodb-backend
django-admin startproject Which_Journal --template https://github.com/mongodb-labs/django-mongodb-project/archive/refs/heads/5.1.x.zip
ls
rmdir Which_Journal/
rmdir -f Which_Journal/
rmdir -r Which_Journal/
rmdir --help Which_Journal/
rm -r Which_Journal/
ls
cd proyecto/
ls
cd ..
django-admin startproject Which_Journal --template https://github.com/mongodb-labs/django-mongodb-project/archive/refs/heads/5.1.x.zip
ls
cd ..
rm -r Which_Journal/
ls
cd entornos/
rm -r Which_Journal/
cd ..
django-admin startproject Which_Journal --template https://github.com/mongodb-labs/django-mongodb-project/archive/refs/heads/5.1.x.zip
ls
cd Which_Journal/
ls
./manage.py runserver
nano Readme.md
ls
nano README.md
./manage.py runserver
ls
clear
ls
./manage.py makemigrations
./manage.py migrate
nano README.md
django-admin --version
cd ..
rm -r Which_Journal/
django-admin startproject Which_Journal --template https://github.com/mongodb-labs/django-mongodb-project/archive/refs/heads/5.1.6.zip
django-admin startproject Which_Journal --template https://github.com/mongodb-labs/django-mongodb-project/archive/refs/heads/5.1.x.zip
rm -r Which_Journal/
django-admin startproject Which_Journal --template https://github.com/mongodb-labs/django-mongodb-project/archive/refs/heads/5.1.x.zip
ls
cd Which_Journal/
ls
python3 manage.py runserver
sudo systemctl status mongod
sudo apt remove --purge mongodb-org
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-keyring.gpg
sudo apt install gpg
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-keyring.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo systemctl start mongod
sudo apt install -y mongodb-org
sudo systemctl start mongod
python3 manage.py runserver
python3 manage.py runserver 0.0.0.0:8000
ls
nano settings.py 
cd ..
python3 manage.py runserver
python3 manage.py runserver 0.0.0.0:8000
clear
sudo apt-get install python3.7-dev
sudo apt-get install python3-dev
pip install uwsgi
sudo apt update
sudo apt install -y build-essential python3-dev
pip install uwsgi
cd ..
ls
nano prueba.py
uwsgi --http :8000 --wsgi-file prueba.py 
ls
rm prueba.py 
ls 
cd Which_Journal/
ls
uwsgi --http :8000 --module Which_Journal/wsgi.py 
uwsgi --http :8000 --module Which_Journal.wsgi.py 
uwsgi --http :8000 --module Which_Journal.wsgi
sudo apt-get install nginx
ls etc
ls
cd Which_Journal/
ls
cd
ls
cd Which_Journal/
ls
ls /etc/nginx
sudo nano /etc/nginx/sites-available/proyecto.conf
nano uwsgi_params
fg
ls /etc/nginx/sites-enabled/
ls -al /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/proyecto.conf /etc/nginx/sites-enabled/
ls -al /etc/nginx/sites-enabled/
cd
cd W
cd Which_Journal/
ls
cd Which_Journal/
nano settings.py 
cd ..
uwsgi --http :8000 --module Which_Journal.wsgi
./manage.py collectstatic
sudo /etc/init.d/nginx restart
journalctl -xeu nginx.service
sudo /etc/init.d/nginx restart
nginx -t
sudo netstat -tulnp | grep -E "80|443"
systemctl status nginx.service
clear
ls
nano uwsgi_params 
sudo nano /etc/nginx/sites-available/proyecto.conf
nano uwsgi_params 
sudo nano /etc/nginx/sites-available/proyecto.conf
ls
sudo nano /etc/nginx/sites-available/proyecto.conf
ls 
ls Which_Journal/
sudo nano /etc/nginx/sites-available/proyecto.conf
ls Which_Journal/
ls -a Which_Journal/
ls -la Which_Journal/
sudo ln -s /etc/nginx/sites-available/proyecto.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/
sudo rm -r /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/proyecto.conf /etc/nginx/sites-enabled/
sudo mkdir -p /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/proyecto.conf /etc/nginx/sites-enabled/
sudo /etc/init.d/nginx restart
mkdir media
cd m
cd media/
wget https://www.notion.so/image/attachment%3Ad2efd98e-9dc4-4544-93c3-76d4998b76c4%3Aimages.jpeg?table=block&id=1a71244a-a3a2-80d5-994f-e1f63223dbb5&spaceId=f2904f29-87f2-495e-a930-75fc5ec51f0b&width=2000&userId=181d872b-594c-811d-9d12-0002a65e3501&cache=v2
ls
rm wget-log 
ls
wget https://www.python.org/static/img/python-logo.png
ls
cd ..
uwsgi --socket
uwsgi --socket Which_Journal.sock --module Which_Journal.wsgi
uwsgi --socket Which_Journal.sock --module Which_Journal.wsgi --chmodd-socket=666
uwsgi --socket Which_Journal.sock --module Which_Journal.wsgi --chmod-socket=666
ls
nano Which_Journal_uwsgi.ini
ls
uwsgi --ini Which_Journal_uwsgi.ini 
nano Which_Journal_uwsgi.ini
ls ..
cd
ls entornos/
cd Which_Journal/
nano Which_Journal_uwsgi.ini
ls Which_Journal/
nano Which_Journal_uwsgi.ini
uwsgi --ini Which_Journal_uwsgi.ini 
clear
cd
cd entornos/proyecto/
ls
mkdir vasallos
sudo ln -s /home/admin/Which_Journal/Which_Journal_uwsgi.ini . 
ls
rm Which_Journal_uwsgi.ini 
rm Which_Journal_uwsgi.ini vasallos/
sudo ln -s /home/admin/Which_Journal/Which_Journal_uwsgi.ini vasallos/
ls vasallos/
cd
uwsgi --emperor ~/entornos/proyecto/vasallos/
uwsgi --emperor ~/entornos/proyecto/vasallos/ --uid www-data -gid www-data
uwsgi --emperor ~/entornos/proyecto/vasallos/ --uid www-data --gid www-data
sudo nano /etc/systemd/system/emperor.uwsgi.service
sudo systemctl enable emperor.uwsgi.service
sudo systemctl start emperor.uwsgi.service
sudo reboot
exit
ls
cd Which_Journal/
ls
cd Which_Journal/
ls
nano settings.py 
sudo restart
sudo reboot
nano settings.py 
cd Which_Journal/
nano settings.py 
sudo reboot
exit
ls
python manage.py startapp Which_Journal_App
exit 
exit
/bin/python3 /home/admin/Which_Journal/Which_Journal/settings.py
sudo reboot
ls
exit
source entornos/proyecto/bin/activate
cd Which_Journal/
python3 manage.py createsuperuser
netstat -tulnp | grep 27017
sudo apt-get install netstat
sudo apt install netstat
sudo nano /etc/mongod.conf
mongo --host localhost --port 27017
python manage.py createsuperuser
sudo systemctl start mongod
python manage.py createsuperuser
sudo reboot
exit
sudo systemctl start mongod
sudo systemctl start mongodsudo systemctl enable mongod
sudo systemctl enable mongod
sudo reboot
exit
sudo reboot
ls
ls -a
sudo reboot
exit
sudo reboot
exit
ls -a
ls -ar
source entornos/proyecto/bin/activate
cd Which_Journal/
ls
cd principal/
ls
cd templates/
ls
cd principal/
ls
clear
nano index.html 
clear
sudo reboot
exit
sudo adduser SantiS
sudo adduser santis
nano ~/.ssh/authorized_keys 
echo "AAAAB3NzaC1yc2EAAAADAQABAAACAQDI51awzG8KOd2SuizArKldOvnX6JVrMmH8T+6MO2jbtwiqClcn0UiYKb0Ie46qBJiU/PlomevxAfsIn4WD6ibH4/qjYHeUY204/UkD0/QabnPdLsxSCLWHxSLWnDqnHrm9Qyk+2SZcHVohmHWExlEiIugyNzRexUfI3E3yyddPT2wPR5nKv3Vzg/daOkjQDp+t6KmLwkPdI4czEGCASvA07DKhs9/8lS0w5ieL+NtEt9GVLwmLF04h1mPDUdkX5vNtXoWSfFmWDAdlW7dgEjX02bJDFcKm2jB7uuTlLcCkwzqPwvbNiqIV4rb3L3XWn2WSgOLEmsgdU/56VJ2ITWxUi+QPSq9/9ubi27aI30DMQlYji3cVwZjoDaNJPTmJ4Jz1VvjIaQFNkqsANDK4p3LM1cojfY40GpKuPh7nRUGiy0tkDRVJTxbZ8YiTxfAVD4ZKRhow/n3NTiy5V4sPEH9q67j8XzDio8f4deX3xEnERGXzVYZWFF7oXwhCmQr9efUuEp4N4Eboci8MBSIqzorGl8t+YktwjUMwz2CjMbesSdOENqj0VAlTwu8cpIV9E2/2ymlLNifDw8nFBCCc7s/1iGnD742CfQY+CFLOOldnYqy6zbRg+31GQGtffWWCHsb0EUcOVYAwAdYpuo6Rzn8F3eyG2z/tdiJRsOX/tDVsRw== santis@santispopos" >> ~/.ssh/authorized_keys
nano ~/.ssh/authorized_keys 
sudo reboot
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
sudo
clear
systemctl ?
systemctl --h
systemctl -h
top
ls -a
ls Which_Journal/
ls entornos/
ls entornos/proyecto/
cd Which_Journal/
clear
ls
cd Which_Journal/
ls
nano urls.py 
cd ..
cd principal/
ls
nano urls.py 
sudo reboot
ls
cd ..
ls
cd ..
ls
cd etc/ssh/
ls
nano ssh_config
sudo nano ssh_config
sudo systemctl restart ssh
sudo reboot
source entornos/proyecto/bin/activate
cd Which_Journal/
python manage.py makemigrations
python manage.py migrate
sudo reboot
source entornos/proyecto/bin/activate
cd Which_Journal/
python manage.py makemigrations
python manage.py migrate
pip install django-mongodb-engine
python manage.py migrate
python manage.py migrate --fake
sudo reboot
source entornos/proyecto/bin/activate
cd Which_Journal/
python manage.py createsuperuser
sudo reboot
source entornos/proyecto/bin/activate
cd Which_Journal/
python manage.py makemigrations
python manage.py migrate
python manage.py migrate principal 0001
python manage.py migrate principal
exit
ls
cd entornos/
ls
cd proyecto/
ls
cd vasallos/
ls
nano Which_Journal_uwsgi.ini 
cd ..
ls 
source entornos/proyecto/bin/activate
pip install django
pip install django-mongodb-backend
django-admin startproject Which_Journal --template https://github.com/mongodb-labs/django-mongodb-project/archive/refs/heads/5.1.x.zip (Para crear un proyecto de Django con Mongo)
django-admin startproject Which_Journal --template https://github.com/mongodb-labs/django-mongodb-project/archive/refs/heads/5.1.x.zip
ls
sudo reboot
ls 
sudo reboot
cd Which_Journal/
ls
cd Which_Journal/
ls
nano settings.py 
cd ..
ls
pip install uwsgi
source ../entornos/proyecto/bin/activate
pip install uwsgi
ls
cd Which_Journal/
ls
cd ..
cd Which_Journal/
nano test.py
uwsgi --http :8000 --wsgi-file test.py
~/Which_Journal uwsgi --http :8000 --module Which_Journal.wsgi
~/Which_Journal$ uwsgi --http :8000 --module Which_Journal.wsgi
uwsgi --http :8000 --wsgi-file test.py
uwsgi --http :8000 --module Which_Journal
ls
ls Which_Journal/
uwsgi --http :8000 --module Which_Journal.uwsgi
uwsgi --http :8000 --module Which_Journal.wsgi
nano settings.py 
nano Which_Journal/settings.py 
uwsgi --http :8000 --module Which_Journal.wsgi
nano Which_Journal/settings.py 
uwsgi --http :8000 --module Which_Journal.wsgi
ls /etc/nginx/
ls /etc/nginx/sites-available/
nano /etc/nginx/sites-available/proyecto.conf 
sudo nano /etc/nginx/sites-available/proyecto.conf 
ls 
nano uwsgi_params 
ls /etc/nginx/sites-enabled/
sudo nano /etc/nginx/sites-enabled/proyecto.conf 
ls -al /etc/nginx/sites-enabled/
ls
./manage.py collectstatic
sudo /etc/init.d/nginx restar
sudo /etc/init.d/nginx restart
mkdir media
cd media/
cd ..
uwsgi --socket Which_Journal.sock --module Which_Journal.wsgi
uwsgi --socket Which_Journal.sock --module Which_Journal.wsgi --chmod-socket=666
nano Which_Journal_uwsgi.ini
uwsgi --ini Which_Journal_uwsgi.ini 
cd
cd entornos/
cd proyecto/
ls
ls vasallos/
uwsgi --emperor ~/entornos/proyecto/vasallos/
uwsgi --emperor ~/entornos/proyecto/vasallos/ --uid www-data --gid www-data 
ls /etc/systemd/system/emperor.uwsgi.service 
sudo nao /etc/systemd/system/emperor.uwsgi.service 
sudo nano /etc/systemd/system/emperor.uwsgi.service 
clear
sudo systemctl --h
sudo systemctl --help
sudo systemctl list-unit
sudo systemctl list-automounts 
sudo reboot
source entornos/proyecto/bin/activate
cd Which_Journal/
./manage.py startapp Principal
ls
exit 
ls
l -al
ls -al
