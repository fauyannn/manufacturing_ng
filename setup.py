# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in manufacturing_ng/__init__.py
from manufacturing_ng import __version__ as version

setup(
	name='manufacturing_ng',
	version=version,
	description='Manufacturing for not good item',
	author='PT. Cipta Dinamika Unggul',
	author_email='fauyannn@gmail.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
