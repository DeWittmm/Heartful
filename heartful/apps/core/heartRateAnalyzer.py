

class HeartRateAnalyzer():
	def maxHR(age):
		if age < 20:
			return 200
		elif age < 30:
			return 190
		elif age <= 35:
			return 185
		elif age < 40:
			return 180
		elif age <= 45:
			return 175
		else:
			return 170
			
	#Returns (50%, 85%)
	def targetHRZone(age):
		if age < 20:
			return (100, 170,)
		elif age < 30:
			return (95, 162,)
		elif age <= 35:
			return (93, 157,)
		elif age < 40:
			return (90, 153,)
		elif age <= 45:
			return (88, 149,)
		else:
			return (85, 145,)