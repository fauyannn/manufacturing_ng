from __future__ import unicode_literals
from frappe import _

def get_data():
	return {
		'fieldname': 'work_order_ng',
		'transactions': [
			{
				'items': ['Pick List', 'Stock Entry', 'Job Card NG']
			}
		]
	}